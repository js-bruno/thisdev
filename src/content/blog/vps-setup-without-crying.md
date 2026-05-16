---
title: "Setting Up a VPS Without Crying: A Realistic Guide"
date: 2025-02-10
description: "From a fresh Debian droplet to a server you can actually trust with your stuff."
tags:
  - vps
  - linux
  - sysadmin
---

You just got a VPS. It's a blank $6/month Debian machine sitting in some datacenter, root password in your clipboard, full of potential and zero protection. Let's fix that in order.

## Step 0: Stop Using Root

The first thing you do after logging in as root is create a real user and disable root SSH login. Every second you spend as root is a second you could accidentally `rm -rf` something important.

```bash
# As root:
adduser jose
usermod -aG sudo jose

# Copy your SSH key to the new user
mkdir -p /home/jose/.ssh
cp ~/.ssh/authorized_keys /home/jose/.ssh/
chown -R jose:jose /home/jose/.ssh
chmod 700 /home/jose/.ssh
chmod 600 /home/jose/.ssh/authorized_keys
```

Log out. Log back in as your new user. Verify `sudo` works. Now you can touch the dangerous stuff with slightly more ceremony.

## Step 1: SSH Hardening

Edit `/etc/ssh/sshd_config`:

```
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
Port 2222
```

Changing the port doesn't stop a determined attacker but it does stop 99% of the automated garbage that hammers port 22 all day. Your logs will thank you.

```bash
sudo systemctl restart sshd
```

Don't close your current session until you've tested the new config from another terminal. Speaking from experience.

## Step 2: Firewall

`ufw` is the human-readable wrapper around `iptables` that lets you not think about chains and tables at 2am:

```bash
sudo apt install ufw

# Default: deny everything in, allow everything out
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow your SSH port (use your actual port)
sudo ufw allow 2222/tcp

# Allow web traffic if you're running a server
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

sudo ufw enable
sudo ufw status verbose
```

Check the status output. Actually read it. Make sure your SSH port is listed before you do anything else.

## Step 3: Unattended Upgrades

Security patches shouldn't require you to remember to run `apt upgrade` every week:

```bash
sudo apt install unattended-upgrades apt-listchanges

sudo dpkg-reconfigure --priority=low unattended-upgrades
# Say yes.
```

Edit `/etc/apt/apt.conf.d/50unattended-upgrades` to enable automatic reboots for kernel updates if you want them (lines with `Automatic-Reboot`). Set a reboot time that's off-peak for your usage.

## Step 4: Fail2ban

Fail2ban watches your logs and bans IPs that make too many failed login attempts. It's not a silver bullet but it reduces noise dramatically:

```bash
sudo apt install fail2ban

# Create local config (don't edit the .conf files, they get overwritten on updates)
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
```

Edit `jail.local`, find the `[sshd]` section, set your port:

```ini
[sshd]
enabled = true
port = 2222
maxretry = 5
bantime = 3600
```

```bash
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Check it's working
sudo fail2ban-client status sshd
```

## Step 5: Something to Actually Run

At this point you have a reasonably hardened server. Now you probably want to deploy something. The minimal working setup for a web app:

```bash
# Install nginx
sudo apt install nginx

# Install certbot for TLS
sudo apt install certbot python3-certbot-nginx

# Get a cert (you need DNS pointing to this server first)
sudo certbot --nginx -d yourdomain.com

# Certbot auto-renews via a systemd timer, check it
sudo systemctl status certbot.timer
```

Your nginx config lives in `/etc/nginx/sites-available/`. The default site in `/etc/nginx/sites-enabled/default` can be deleted once you set up your own.

## Step 6: Monitoring (the Minimum)

You want to know when things go wrong before your users tell you:

```bash
# Check what's eating memory/CPU right now
htop

# Check disk usage before it fills up and ruins your day
df -h

# Check for failed systemd services
systemctl --failed

# Watch logs in real time
journalctl -f
```

For actual alerting, the simplest free option is UptimeRobot — point it at your domain, get an email when it goes down. It's not glamorous but it works at 3am when you're asleep.

## The Mental Model

A VPS is just a computer that runs when you're not looking. Treat it like one: keep software updated, use SSH keys instead of passwords, don't give services more permissions than they need, and have a backup strategy before you need it.

The hardest part isn't the technical setup. It's developing the habit of checking in on it occasionally, like a plant that also runs your side projects.
