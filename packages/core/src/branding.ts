export const NAME = "SCLAW"
export const LOGO_TITLE = "SClaw"
export const SLUG = "sclaw"
export const TAGLINE = "SiliconClaw"
export const FULL_NAME = "SCLAW — Silicon Closure and Layout Agentic Workflow"
export const CLI_BINARY = "sclaw"
export const DEFAULT_SERVER_USERNAME = "sclaw"

export const LEGACY_SLUG = "opencode"
export const LEGACY_CONFIG_DIR = ".opencode"
export const LEGACY_CONFIG_FILES = ["opencode.json", "opencode.jsonc"] as const

export const CONFIG_DIR = ".sclaw"
export const CONFIG_FILES = ["sclaw.json", "sclaw.jsonc"] as const

export const ALL_CONFIG_FILES = [...CONFIG_FILES, ...LEGACY_CONFIG_FILES, "config.json"] as const
export const ALL_CONFIG_DIRS = [CONFIG_DIR, LEGACY_CONFIG_DIR] as const

export * as Branding from "./branding"
export * as BrandingLogo from "./branding-logo"
