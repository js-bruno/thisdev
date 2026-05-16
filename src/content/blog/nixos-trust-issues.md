---
title: "I Installed NixOS and Now I Have Trust Issues With Every Other OS"
date: 2025-03-15
description: "A journey into the land of declarative configuration, failed builds, and eventual enlightenment."
tags:
  - nix
  - linux
---

So I did the thing. I wiped my perfectly functional Arch install — yes, I mentioned it constantly — and replaced it with NixOS. My friends said I had a problem. They were right, just not about which one.

## What Even Is Nix

Nix is a package manager built on the radical idea that your system configuration should be *reproducible*, *atomic*, and *declarative*. In practice this means: you write a `configuration.nix` file, you run `nixos-rebuild switch`, and your entire system becomes exactly what you described. No more "works on my machine". No more dependency hell. No more mystery packages installed in 2019 that you're afraid to remove because the whole thing might collapse.

The deal is that every package lives in `/nix/store/` under a hash-prefixed path like:

```
/nix/store/9xq5ydqw3nf2k...-firefox-120.0/bin/firefox
```

Two versions of Firefox can coexist without conflict. Rolling back is just switching a symlink. It's the kind of thing that sounds insane until you've spent 4 hours fighting `apt` dependency conflicts.

## The Configuration File

Your entire OS lives in one file (or a few, if you modularize). Here's a minimal example:

```nix
{ config, pkgs, ... }:

{
  imports = [ ./hardware-configuration.nix ];

  boot.loader.systemd-boot.enable = true;
  boot.loader.efi.canTouchEfiVariables = true;

  networking.hostName = "my-machine";
  networking.networkmanager.enable = true;

  time.timeZone = "America/Sao_Paulo";

  users.users.jose = {
    isNormalUser = true;
    extraGroups = [ "wheel" "networkmanager" ];
    packages = with pkgs; [ firefox git neovim ];
  };

  environment.systemPackages = with pkgs; [
    wget
    curl
    htop
  ];

  system.stateVersion = "24.05";
}
```

That's it. That's your OS. If you give this file to someone else, they get the same system. Not "mostly the same". *The same.*

## Home Manager: Going Deeper

Once you've tasted declarative system config, you want it for your dotfiles too. Enter Home Manager, which lets you manage your user environment the same way:

```nix
{ config, pkgs, ... }:

{
  home.username = "jose";
  home.homeDirectory = "/home/jose";

  programs.git = {
    enable = true;
    userName = "José Bruno";
    userEmail = "jose@example.com";
    extraConfig.core.editor = "nvim";
  };

  programs.zsh = {
    enable = true;
    enableAutosuggestions = true;
    syntaxHighlighting.enable = true;
  };

  home.stateVersion = "24.05";
}
```

Your git config. Your shell config. Your neovim config. All in Nix. All reproducible.

## The Pain Points (There Are Some)

I'm not going to pretend it's perfect:

- **The learning curve is steep.** Nix has its own functional language. It looks like nothing else. `pkgs.lib.mkIf`, `let ... in`, attribute sets — it takes time.
- **Binary cache misses hurt.** If you're building something not in the cache, you're building it from source. On a weak machine, that's a long lunch break.
- **Error messages are... creative.** The Nix evaluator will sometimes tell you there's an "infinite recursion" without hinting at where. You learn to narrow it down methodically.
- **Flakes are "experimental" but everyone uses them.** There's a `--experimental-features nix-command flakes` flag you'll add to your config on day one and never remove.

## Was It Worth It

Yeah. Three months in, I've rebuilt this config on a new machine in under 20 minutes. I've rolled back a broken desktop environment in 30 seconds. I've shared my setup with a friend and it worked on their hardware with two lines changed.

The trust issues with other systems are real though. Last week I helped someone debug their Ubuntu server and I physically flinched when they ran `apt install` without checking what it would change.

Touch grass. Install NixOS. Embrace the hash.
