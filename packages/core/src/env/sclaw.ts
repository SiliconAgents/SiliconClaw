const warned = new Set<string>()

export function readSclawEnvironment(sclawName: string, legacyName: string) {
  const sclaw = process.env[sclawName]
  if (sclaw !== undefined) return sclaw

  const legacy = process.env[legacyName]
  if (legacy === undefined) return undefined

  if (!warned.has(legacyName)) {
    warned.add(legacyName)
    console.warn(`[sclaw] ${legacyName} is deprecated; use ${sclawName} instead`)
  }
  return legacy
}

export function readSclawTruthy(sclawName: string, legacyName: string) {
  const value = readSclawEnvironment(sclawName, legacyName)?.toLowerCase()
  return value === "true" || value === "1"
}

export * as SclawEnv from "./sclaw"
