# Uses

The setup. Yes, the config is on GitHub.

## Editor

**Neovim**, configured in Lua, managed with `lazy.nvim`.

```lua
-- the plugins that earn their keep
{
  "folke/snacks.nvim",          -- picker, explorer, dashboard, everything
  "neovim/nvim-lspconfig",      -- LSP
  "nvim-treesitter/nvim-treesitter",
  "MeanderingProgrammer/render-markdown.nvim",
  "folke/which-key.nvim",
  "nvim-lualine/lualine.nvim",
}
```

Leader is `<Space>`. It has always been `<Space>`.

## Operating system

**NixOS**, declaratively configured, flake-based, with `home-manager` for the
user side. The whole machine rebuilds from one repo.

```nix
{
  description = "one config, every machine";

  outputs = { self, nixpkgs, home-manager, ... }: {
    nixosConfigurations.workstation = nixpkgs.lib.nixosSystem {
      system = "x86_64-linux";
      modules = [ ./hosts/workstation home-manager.nixosModules.default ];
    };
  };
}
```

## Keyboard

**Corne** split keyboard, 42 keys, hand-soldered. Column-stagger, three
layers, home-row mods.

- [x] Soldered it myself
- [x] Flashed custom firmware
- [x] Rewired muscle memory from scratch
- [ ] Stopped talking about it

## Terminal

- Shell — `zsh` with minimal prompt
- Multiplexer — `tmux`, prefix remapped off `C-b`
- Font — JetBrains Mono Nerd Font
- Colorscheme — whichever one you have selected right now

> [!IMPORTANT]
> The colorscheme on this site is real. Try `:colorscheme` or `<Space>uc`.
