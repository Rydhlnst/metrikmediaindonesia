#!/bin/sh
set -u

label="${1:-task}"
shift

echo "[$label] Starting task: $*"
if "$@"; then
  echo "[$label] Task completed successfully."
  exit 0
fi

status=$?
echo "[$label] Task failed with exit code $status. Container will remain running for diagnosis."
while :; do
  sleep 3600
done
