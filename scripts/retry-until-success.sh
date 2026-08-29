#!/bin/sh
set -u

label="${1:-task}"
shift

while :; do
  echo "[$label] Running task: $*"
  if "$@"; then
    echo "[$label] Task completed successfully."
    exit 0
  fi

  status=$?
  echo "[$label] Task failed with exit code $status; retrying in 15 seconds."
  sleep 15
done
