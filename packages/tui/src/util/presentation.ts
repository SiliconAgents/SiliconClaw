import { Branding } from "@opencode-ai/core/branding"
import { BrandingLogo } from "@opencode-ai/core/branding"

const reset = "\x1b[0m"
const bold = "\x1b[1m"
const dim = "\x1b[90m"

function wordmark(pad = "") {
  return [
    ...BrandingLogo.titleLines.map((line) => `${pad}${bold}${BrandingLogo.plainTitleLine(line)}${reset}`),
    `${pad}${dim}${Branding.TAGLINE}${reset}`,
  ]
}

export function sessionEpilogue(input: { title: string; sessionID?: string }) {
  const weak = (text: string) => `${dim}${text.padEnd(10, " ")}${reset}`
  return [
    ...wordmark("  "),
    "",
    `  ${weak("Session")}${bold}${input.title}${reset}`,
    `  ${weak("Continue")}${bold}${Branding.CLI_BINARY} -s ${input.sessionID}${reset}`,
    "",
  ].join("\n")
}
