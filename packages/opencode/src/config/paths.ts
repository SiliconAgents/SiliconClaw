export * as ConfigPaths from "./paths"

import path from "path"
import { Branding } from "@opencode-ai/core/branding"
import { Flag } from "@opencode-ai/core/flag/flag"
import { Global } from "@opencode-ai/core/global"
import { unique } from "remeda"
import * as Effect from "effect/Effect"
import { FSUtil } from "@opencode-ai/core/fs-util"

export const files = Effect.fn("ConfigPaths.projectFiles")(function* (
  name: string,
  directory: string,
  worktree?: string,
) {
  const afs = yield* FSUtil.Service
  return (yield* afs.up({
    targets: [`${name}.jsonc`, `${name}.json`],
    start: directory,
    stop: worktree,
  })).toReversed()
})

export const projectConfigFiles = Effect.fn("ConfigPaths.projectConfigFiles")(function* (
  directory: string,
  worktree?: string,
) {
  const sclaw = yield* files(Branding.SLUG, directory, worktree)
  const legacy = yield* files(Branding.LEGACY_SLUG, directory, worktree)
  return unique([...sclaw, ...legacy])
})

export const directories = Effect.fn("ConfigPaths.directories")(function* (directory: string, worktree?: string) {
  const afs = yield* FSUtil.Service
  return unique([
    Global.Path.config,
    ...(!Flag.OPENCODE_DISABLE_PROJECT_CONFIG
      ? yield* afs.up({
          targets: [...Branding.ALL_CONFIG_DIRS],
          start: directory,
          stop: worktree,
        })
      : []),
    ...(yield* afs.up({
      targets: [...Branding.ALL_CONFIG_DIRS],
      start: Global.Path.home,
      stop: Global.Path.home,
    })),
    ...(Flag.OPENCODE_CONFIG_DIR ? [Flag.OPENCODE_CONFIG_DIR] : []),
  ])
})

export function fileInDirectory(dir: string, name: string) {
  return [path.join(dir, `${name}.json`), path.join(dir, `${name}.jsonc`)]
}

export function allFilesInDirectory(dir: string) {
  return [
    ...fileInDirectory(dir, Branding.SLUG),
    ...fileInDirectory(dir, Branding.LEGACY_SLUG),
  ]
}
