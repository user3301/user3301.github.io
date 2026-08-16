-- ~/.config/nvim/init.lua
-- The short version, in a language I actually think in.

local M = {}

M.setup = function()
  vim.g.mapleader = " "

  return {
    name     = "user3301",
    title    = "Senior Software Engineer",
    location = { tz = "UTC+10", remote = true, worldwide = true },
    status   = "open_to_opportunities",

    experience_years = 10,

    stack = {
      languages = { "go", "c#", "java", "python", "bash", "lua", "nix" },
      platforms = { "nixos", "linux", "windows/wsl2" },
      infra     = { "kubernetes", "helm", "skaffold", "grpc", "docker" },
      clouds    = { "gcp", "azure", "aws" },
    },

    editor = {
      name        = "neovim",
      leader      = "<Space>",
      config_lang = "lua",
      plugins     = 60,           -- it fluctuates
      startuptime = "27ms",       -- it does not
    },

    keyboard = {
      model  = "corne",
      keys   = 42,
      split  = true,
      soldered_by = "me",
    },
  }
end

-- Opinions, held loosely but held.
M.principles = {
  "Delete more than you add.",
  "The local dev loop is the product's real velocity.",
  "Declarative beats imperative when you have to sleep at night.",
  "If it isn't in version control, it doesn't exist.",
  "Boring technology, interesting problems.",
}

return M
