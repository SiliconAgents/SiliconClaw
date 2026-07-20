// Logo art only — put ASCII/block lines in titleLines, not TypeScript source code.

export const titleLines = [
  "██████████  ██████████  ██            ██████    ██              ██",
  "██          ██          ██          ██      ██  ██              ██",
  "██          ██          ██          ██      ██  ██              ██",
  "██████████  ██          ██          ██████████  ██      ██      ██",
  "        ██  ██          ██          ██      ██  ██      ██      ██",
  "        ██  ██          ██          ██      ██  ██    ██  ██    ██",
  "██████████  ██████████  ██████████  ██      ██  ██████      ██████",
] as const

export function plainTitleLine(line: string) {
  return [...line]
    .map((char) => {
      if (char === "_") return " "
      if (char === "^" || char === "~") return "▀"
      return char
    })
    .join("")
}
