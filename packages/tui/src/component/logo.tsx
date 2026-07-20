import { TextAttributes } from "@opentui/core"
import { For } from "solid-js"
import { Branding } from "@opencode-ai/core/branding"
import { BrandingLogo } from "@opencode-ai/core/branding"
import { tint, useTheme } from "../context/theme"

function TitleLine(props: { line: string }) {
  const { theme } = useTheme()
  const shadow = tint(theme.background, theme.text, 0.25)

  return (
    <box flexDirection="row">
      <For each={[...props.line]}>
        {(char) => {
          if (char === "_") {
            return (
              <text fg={theme.text} bg={shadow} attributes={TextAttributes.BOLD} selectable={false}>
                {" "}
              </text>
            )
          }
          if (char === "^") {
            return (
              <text fg={theme.text} bg={shadow} attributes={TextAttributes.BOLD} selectable={false}>
                ▀
              </text>
            )
          }
          if (char === "~") {
            return (
              <text fg={shadow} attributes={TextAttributes.BOLD} selectable={false}>
                ▀
              </text>
            )
          }
          return (
            <text fg={theme.text} attributes={TextAttributes.BOLD} selectable={false}>
              {char}
            </text>
          )
        }}
      </For>
    </box>
  )
}

export function Logo() {
  const { theme } = useTheme()

  return (
    <box alignItems="center" gap={0}>
      <For each={BrandingLogo.titleLines}>{(line) => <TitleLine line={line} />}</For>
      <box height={1} />
      <text fg={theme.textMuted} selectable={false}>
        {Branding.TAGLINE}
      </text>
    </box>
  )
}
