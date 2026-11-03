#!/bin/bash
# Daily export run by launchd (see README): export the vault, and if the
# data changed, commit and push it. Only data/ is ever committed, so
# unfinished work elsewhere in the repo is left alone.
# On failure a macOS notification pops up; details are in the log.
#
# --deploy: after a successful push, also trigger the website's "Daily
# rebuild" workflow so the change goes live right away (used by the
# manual "Obsidian-Export" shortcut; the 5:30 run doesn't need it).

set -uo pipefail

DEPLOY=false
[ "${1:-}" = "--deploy" ] && DEPLOY=true
WEBSITE_REPO="iam-robin/personal-website"
# Homebrew (gh) isn't on the PATH when started from launchd or Shortcuts
export PATH="/opt/homebrew/bin:$PATH"

REPO="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$REPO" || exit 1

notify_failure() {
    echo "FAILED: $1"
    osascript -e "display notification \"$1 – siehe ~/Library/Logs/obsidian-export.log\" with title \"Obsidian-Export fehlgeschlagen\"" 2>/dev/null
    exit 1
}

echo "=== $(date '+%Y-%m-%d %H:%M:%S') ==="

# The export commits straight to main of the website repo, so only run when
# main is checked out and has nothing unpushed (that would be pushed along).
[ "$(git branch --show-current)" = "main" ] || notify_failure "Website-Repo ist nicht auf main"
git pull -q --ff-only || notify_failure "git pull fehlgeschlagen"
[ -z "$(git rev-list @{u}..HEAD)" ] || notify_failure "main hat ungepushte Commits"

# launchd starts without the shell profile, so load node via nvm
export NVM_DIR="$HOME/.nvm"
# shellcheck source=/dev/null
. "$NVM_DIR/nvm.sh" >/dev/null 2>&1 && nvm use default >/dev/null 2>&1 || notify_failure "Node nicht gefunden"

node scripts/export/export-all.mjs || notify_failure "Export-Script ist abgebrochen"

if [ -z "$(git status --porcelain -- data)" ]; then
    echo "No changes."
    exit 0
fi

git add -- data || notify_failure "git add fehlgeschlagen"
git commit -q -m "chore: automatic export" -- data || notify_failure "git commit fehlgeschlagen"
git push -q || notify_failure "git push fehlgeschlagen"
echo "Pushed: $(git log --oneline -1)"

if $DEPLOY; then
    gh workflow run "Daily rebuild" -R "$WEBSITE_REPO" || notify_failure "Website-Deploy konnte nicht gestartet werden"
    echo "Triggered website rebuild."
fi
