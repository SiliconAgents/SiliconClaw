// This method is called when your extension is deactivated
export function deactivate() {}

import * as vscode from "vscode"

const TERMINAL_NAME = "SCLAW"
const CLI = "sclaw"

export function activate(context: vscode.ExtensionContext) {
  const openNewTerminalDisposable = vscode.commands.registerCommand("sclaw.openNewTerminal", async () => {
    await openTerminal(context)
  })

  const openTerminalDisposable = vscode.commands.registerCommand("sclaw.openTerminal", async () => {
    const existingTerminal = vscode.window.terminals.find((t) => t.name === TERMINAL_NAME)
    if (existingTerminal) {
      existingTerminal.show()
      return
    }

    await openTerminal(context)
  })

  const addFilepathDisposable = vscode.commands.registerCommand("sclaw.addFilepathToTerminal", async () => {
    const fileRef = getActiveFile()
    if (!fileRef) {
      return
    }

    const terminal = vscode.window.activeTerminal
    if (!terminal) {
      return
    }

    if (terminal.name === TERMINAL_NAME) {
      const port = extensionPort(terminal.creationOptions)
      port ? await appendPrompt(port, fileRef) : terminal.sendText(fileRef, false)
      terminal.show()
    }
  })

  context.subscriptions.push(openNewTerminalDisposable, openTerminalDisposable, addFilepathDisposable)
}

function extensionPort(options: vscode.TerminalOptions | vscode.ExtensionTerminalOptions) {
  const env = "env" in options ? options.env : undefined
  const raw = env?.["_EXTENSION_SCLAW_PORT"] ?? env?.["_EXTENSION_OPENCODE_PORT"]
  if (!raw) return
  const port = parseInt(raw, 10)
  return Number.isFinite(port) ? port : undefined
}

async function openTerminal(context: vscode.ExtensionContext) {
  const port = Math.floor(Math.random() * (65535 - 16384 + 1)) + 16384
  const terminal = vscode.window.createTerminal({
    name: TERMINAL_NAME,
    iconPath: {
      light: vscode.Uri.file(context.asAbsolutePath("images/button-dark.svg")),
      dark: vscode.Uri.file(context.asAbsolutePath("images/button-light.svg")),
    },
    location: {
      viewColumn: vscode.ViewColumn.Beside,
      preserveFocus: false,
    },
    env: {
      _EXTENSION_SCLAW_PORT: port.toString(),
      _EXTENSION_OPENCODE_PORT: port.toString(),
      SCLAW_CALLER: "vscode",
      OPENCODE_CALLER: "vscode",
    },
  })

  terminal.show()
  terminal.sendText(`${CLI} --port ${port}`)

  const fileRef = getActiveFile()
  if (!fileRef) {
    return
  }

  let tries = 10
  let connected = false
  do {
    await new Promise((resolve) => setTimeout(resolve, 200))
    try {
      await fetch(`http://localhost:${port}/app`)
      connected = true
      break
    } catch {}

    tries--
  } while (tries > 0)

  if (connected) {
    await appendPrompt(port, `In ${fileRef}`)
    terminal.show()
  }
}

async function appendPrompt(port: number, text: string) {
  await fetch(`http://localhost:${port}/tui/append-prompt`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  })
}

function getActiveFile() {
  const activeEditor = vscode.window.activeTextEditor
  if (!activeEditor) {
    return
  }

  const document = activeEditor.document
  const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri)
  if (!workspaceFolder) {
    return
  }

  const relativePath = vscode.workspace.asRelativePath(document.uri)
  let filepathWithAt = `@${relativePath}`

  const selection = activeEditor.selection
  if (!selection.isEmpty) {
    const startLine = selection.start.line + 1
    const endLine = selection.end.line + 1

    if (startLine === endLine) {
      filepathWithAt += `#L${startLine}`
    } else {
      filepathWithAt += `#L${startLine}-${endLine}`
    }
  }

  return filepathWithAt
}
