import type { Argv } from "yargs"
import path from "path"
import fs from "fs/promises"
import { existsSync } from "fs"
import { Branding } from "@opencode-ai/core/branding"
import { Global } from "@opencode-ai/core/global"
import { UI } from "../ui"
import * as prompts from "@clack/prompts"

export const MigrateCommand = {
  command: "migrate <target>",
  describe: "migrate legacy configuration into SCLAW-native paths",
  builder: (yargs: Argv) =>
    yargs
      .positional("target", {
        describe: "migration source",
        type: "string",
        choices: ["opencode"] as const,
        demandOption: true,
      })
      .option("dry-run", {
        type: "boolean",
        describe: "show what would be migrated without copying files",
        default: false,
      }),
  handler: async (args: { target: string; dryRun: boolean }) => {
    if (args.target !== "opencode") {
      UI.error(`Unknown migration target: ${args.target}`)
      process.exit(1)
    }
    await migrateOpencode(args.dryRun)
  },
}

async function migrateOpencode(dryRun: boolean) {
  UI.empty()
  UI.println(UI.logo("  "))
  UI.empty()
  prompts.intro("Migrate OpenCode configuration")

  const migrated: string[] = []
  const preserved: string[] = []

  for (const file of Branding.LEGACY_CONFIG_FILES) {
    const source = path.join(Global.Path.config, file)
    if (!existsSync(source)) continue
    const target = path.join(Global.Path.config, file.replace(Branding.LEGACY_SLUG, Branding.SLUG))
    if (existsSync(target)) {
      preserved.push(`${file} (SCLAW target already exists)`)
      continue
    }
    if (!dryRun) await fs.copyFile(source, target)
    migrated.push(`${file} → ${path.basename(target)}`)
    preserved.push(`Original ${file}`)
  }

  const legacyDir = path.join(Global.Path.home, Branding.LEGACY_CONFIG_DIR)
  const targetDir = path.join(Global.Path.home, Branding.CONFIG_DIR)
  if (existsSync(legacyDir)) {
    if (!existsSync(targetDir)) {
      if (!dryRun) await copyDirectory(legacyDir, targetDir)
      migrated.push(`${Branding.LEGACY_CONFIG_DIR}/ → ${Branding.CONFIG_DIR}/`)
    }
    preserved.push(`Original ${Branding.LEGACY_CONFIG_DIR}/`)
  }

  const projectLegacy = path.join(process.cwd(), Branding.LEGACY_CONFIG_DIR)
  const projectTarget = path.join(process.cwd(), Branding.CONFIG_DIR)
  if (existsSync(projectLegacy) && projectLegacy !== legacyDir) {
    if (!existsSync(projectTarget)) {
      if (!dryRun) await copyDirectory(projectLegacy, projectTarget)
      migrated.push(`./${Branding.LEGACY_CONFIG_DIR}/ → ./${Branding.CONFIG_DIR}/`)
    }
    preserved.push(`Original ./${Branding.LEGACY_CONFIG_DIR}/`)
  }

  if (migrated.length === 0) {
    prompts.log.info("No legacy OpenCode configuration found to migrate")
    prompts.outro("Done")
    return
  }

  prompts.log.success("Migrated:")
  for (const item of migrated) prompts.log.message(`  ${item}`)
  prompts.log.info("Preserved:")
  for (const item of preserved) prompts.log.message(`  ${item}`)
  if (dryRun) prompts.log.warn("Dry run - no files were copied")
  prompts.outro("Done")
}

async function copyDirectory(source: string, target: string) {
  await fs.mkdir(target, { recursive: true })
  const entries = await fs.readdir(source, { withFileTypes: true })
  for (const entry of entries) {
    const from = path.join(source, entry.name)
    const to = path.join(target, entry.name)
    if (entry.isDirectory()) {
      await copyDirectory(from, to)
      continue
    }
    await fs.copyFile(from, to)
  }
}
