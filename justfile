# pulse-web task runner
#
# Usage:  `just <command>`  (install just: https://github.com/casey/just)
# Most developers will only need: `just dev` and `just build`.

# Default task: show this help.
default:
    @just --list

# Start the local dev server at http://localhost:5173.
dev:
    pnpm dev

# Install dependencies (run once after cloning).
install:
    pnpm install

# Production build. Output goes to ./dist. Uses BASE_PATH so URLs work both
# locally (root /) and when deployed to GitHub Pages at /pulse-web/.
build:
    pnpm build

# Build with the GitHub Pages base path baked in, then preview at
# http://localhost:4173. Use this to verify the production site *before* pushing.
build-gh:
    BASE_PATH=/pulse-web/ pnpm build
    pnpm preview

# Type-check without emitting. Fast and runs in CI.
typecheck:
    pnpm exec tsc -b --noEmit

# Remove all build artifacts.
clean:
    rm -rf dist node_modules/.vite

# Nuke and reinstall. Use when pnpm-lock.yaml is mysteriously broken.
reinstall:
    rm -rf node_modules pnpm-lock.yaml
    pnpm install
