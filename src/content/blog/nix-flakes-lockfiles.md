---
title: "Nix Flakes: Locking Your Dependencies So You Can Finally Sleep at Night"
date: 2025-04-20
description: "Flakes are the reproducibility upgrade Nix didn't know it needed. Here's the practical version."
tags:
  - nix
  - flakes
---

Nix without flakes is like Git without a lockfile — it works, but it works *differently* on different days depending on which channel you last updated. Flakes fix that.

## What a Flake Is

A flake is a Nix project with a `flake.nix` at its root and a `flake.lock` that pins every dependency to an exact commit hash. The `flake.lock` is committed to your repo. Anyone who clones it and runs `nix build` gets byte-for-byte the same output. Forever. Until heat death.

A minimal `flake.nix`:

```nix
{
  description = "My personal system config";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.05";
    home-manager = {
      url = "github:nix-community/home-manager/release-24.05";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { self, nixpkgs, home-manager, ... }: {
    nixosConfigurations.my-machine = nixpkgs.lib.nixosSystem {
      system = "x86_64-linux";
      modules = [
        ./configuration.nix
        home-manager.nixosModules.home-manager
        {
          home-manager.useGlobalPkgs = true;
          home-manager.useUserPackages = true;
          home-manager.users.jose = import ./home.nix;
        }
      ];
    };
  };
}
```

The `inputs.nixpkgs.follows = "nixpkgs"` line tells Home Manager to use the *same* nixpkgs pin as your system, not its own. This is important. Without it, you might have two slightly different versions of nixpkgs being evaluated and things get weird.

## The Lock File

After your first `nixos-rebuild switch --flake .#my-machine`, Nix generates `flake.lock`:

```json
{
  "nodes": {
    "nixpkgs": {
      "locked": {
        "lastModified": 1714000000,
        "narHash": "sha256-abc123...",
        "owner": "NixOS",
        "repo": "nixpkgs",
        "rev": "a3a3a3a3a3a3a3a3...",
        "type": "github"
      }
    }
  }
}
```

Commit this. Every collaborator, every CI run, every machine rebuild will use that exact nixpkgs revision. The hash means tampering is detectable. The rev means you know exactly what code you're running.

To update: `nix flake update`. To update just one input: `nix flake update nixpkgs`.

## Dev Shells: The Party Trick

Flakes really shine for project environments. Instead of `nvm`, `pyenv`, `rbenv`, `sdkman`, and whatever mess manages your Go versions — one `flake.nix` per project:

```nix
{
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { self, nixpkgs }: let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};
  in {
    devShells.${system}.default = pkgs.mkShell {
      buildInputs = with pkgs; [
        nodejs_20
        nodePackages.pnpm
        git
      ];
      shellHook = ''
        echo "Node $(node --version) | pnpm $(pnpm --version)"
      '';
    };
  };
}
```

Run `nix develop` in that directory, and you're in a shell with exactly Node 20 and pnpm. Leave the shell, they're gone. Your system Node is untouched.

With `direnv` + `nix-direnv`, you don't even run `nix develop` manually — entering the directory activates the environment automatically.

## Common Gotchas

**"error: flake 'git+file:///...' does not provide attribute"** — Nix only sees files tracked by git. Run `git add flake.nix flake.lock` before building.

**Updating breaks things** — Pin to a stable channel (`nixos-24.05`) in production. Use `nixos-unstable` only if you enjoy living dangerously and have a good rollback story.

**The first build takes forever** — It's pulling everything from the binary cache. Subsequent builds are fast. The `nix.settings.substituters` list is your friend; add `https://cache.nixos.org` and `https://nix-community.cachix.org` to avoid building common things from source.

## The Payoff

My entire development environment — all projects, all tools, the OS itself — is pinned, reproducible, and version controlled. I've blown away this machine twice for hardware reasons. Both times: `git clone`, `nixos-rebuild`, done.

The first flake is the hardest. After that, you start writing `flake.nix` files for everything and wondering how you ever lived without it.
