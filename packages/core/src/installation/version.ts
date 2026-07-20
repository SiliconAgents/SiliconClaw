declare global {
  const SCLAW_VERSION: string
  const SCLAW_CHANNEL: string
  const OPENCODE_VERSION: string
  const OPENCODE_CHANNEL: string
}

function compileVersion() {
  if (typeof SCLAW_VERSION === "string") return SCLAW_VERSION
  if (typeof OPENCODE_VERSION === "string") return OPENCODE_VERSION
  return "local"
}

function compileChannel() {
  if (typeof SCLAW_CHANNEL === "string") return SCLAW_CHANNEL
  if (typeof OPENCODE_CHANNEL === "string") return OPENCODE_CHANNEL
  return "local"
}

export const InstallationVersion = compileVersion()
export const InstallationChannel = compileChannel()
export const InstallationLocal = InstallationChannel === "local"
