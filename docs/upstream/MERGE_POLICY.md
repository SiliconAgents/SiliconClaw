# Upstream Merge Policy

SCLAW maintains a fork of [OpenCode](https://github.com/anomalyco/opencode). Upstream changes should not be merged directly into `main`.

## Remotes

- `origin` — SCLAW repository
- `opencode-upstream` — https://github.com/anomalyco/opencode.git

## Branches

| Branch | Purpose |
|--------|---------|
| `main` | Stable SCLAW development |
| `sclaw-dev` | Active development |
| `upstream-sync` | Clean upstream synchronization |
| `release/*` | Release preparation |

## Synchronization Process

1. Fetch OpenCode upstream into `upstream-sync`
2. Run OpenCode compatibility tests
3. Review branding and package conflicts
4. Cherry-pick or merge into `sclaw-dev`
5. Run SCLAW integration tests
6. Merge into `main`

Record the upstream base commit in `docs/upstream/BASE_COMMIT` after each sync.
