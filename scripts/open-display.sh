#!/bin/zsh

set -euo pipefail

readonly DEFAULT_SEARCH_URL="https://krydix.github.io/BvgDisplay/search.html"
readonly DEFAULT_DURATION=300
readonly CHROME_BINARY="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

function usage() {
    cat <<'EOF'
Usage:
  ./scripts/open-display.sh
  ./scripts/open-display.sh <stop-id> [duration-seconds]
  ./scripts/open-display.sh <full-url> [duration-seconds]

Examples:
  ./scripts/open-display.sh
  ./scripts/open-display.sh 900003201 600
  ./scripts/open-display.sh "https://krydix.github.io/BvgDisplay/index.html?stop=900003201" 900
EOF
}

if [[ ! -x "$CHROME_BINARY" ]]; then
    echo "Google Chrome not found at $CHROME_BINARY" >&2
    exit 1
fi

target="${1:-}"
duration="${2:-$DEFAULT_DURATION}"

if [[ "$target" == "-h" || "$target" == "--help" ]]; then
    usage
    exit 0
fi

if [[ -z "$target" ]]; then
    url="$DEFAULT_SEARCH_URL"
elif [[ "$target" == http://* || "$target" == https://* ]]; then
    url="$target"
else
    url="https://krydix.github.io/BvgDisplay/index.html?stop=${target}"
fi

if ! [[ "$duration" =~ ^[0-9]+$ ]] || [[ "$duration" -le 0 ]]; then
    echo "Duration must be a positive number of seconds." >&2
    exit 1
fi

profile_dir="$(mktemp -d "${TMPDIR:-/tmp}/bvgdisplay-chrome.XXXXXX")"
chrome_pid=""

function cleanup() {
    if [[ -n "$chrome_pid" ]] && kill -0 "$chrome_pid" 2>/dev/null; then
        kill "$chrome_pid" 2>/dev/null || true
        for _ in {1..20}; do
            if ! kill -0 "$chrome_pid" 2>/dev/null; then
                break
            fi
            sleep 0.1
        done

        if kill -0 "$chrome_pid" 2>/dev/null; then
            kill -9 "$chrome_pid" 2>/dev/null || true
        fi
    fi

    rm -rf "$profile_dir"
}

trap cleanup EXIT INT TERM

"$CHROME_BINARY" \
    --user-data-dir="$profile_dir" \
    --no-first-run \
    --no-default-browser-check \
    --kiosk \
    "$url" >/dev/null 2>&1 &
chrome_pid=$!

osascript -e 'tell application "Google Chrome" to activate' >/dev/null 2>&1 || true

echo "Opened $url in Chrome kiosk mode for ${duration}s."
sleep "$duration"