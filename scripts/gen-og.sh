#!/usr/bin/env bash
# Render OG cards from scripts/og-*.html into public/og-*.png at 1200x630.
# Uses headless Chrome, no npm dependencies. Works on macOS, Linux and Windows (Git Bash).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

CHROME=""
for c in \
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  "/Applications/Chromium.app/Contents/MacOS/Chromium" \
  "/c/Program Files/Google/Chrome/Application/chrome.exe" \
  "/c/Program Files (x86)/Google/Chrome/Application/chrome.exe" \
  "$(command -v google-chrome 2>/dev/null || true)" \
  "$(command -v chromium 2>/dev/null || true)" \
  "$(command -v chromium-browser 2>/dev/null || true)"; do
  if [ -n "$c" ] && [ -x "$c" ]; then CHROME="$c"; break; fi
done
if [ -z "$CHROME" ]; then
  echo "error: need Google Chrome or Chromium installed" >&2
  exit 1
fi

# Chrome on Windows needs a C:/ path, not a Git Bash /c/ path.
native() {
  if command -v cygpath >/dev/null 2>&1; then cygpath -m "$1"; else echo "$1"; fi
}

mkdir -p "$ROOT/public"

render() {
  local name="$1"
  local html out
  html="$(native "$ROOT/scripts/$name.html")"
  out="$(native "$ROOT/public/$name.png")"
  echo "rendering $name"
  "$CHROME" \
    --headless \
    --disable-gpu \
    --hide-scrollbars \
    --no-sandbox \
    --window-size=1200,630 \
    --screenshot="$out" \
    --virtual-time-budget=4000 \
    "file:///${html#/}" > /dev/null 2>&1
}

render og-default

echo "done: OG images regenerated in public/"
