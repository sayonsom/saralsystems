#!/bin/bash

titles=(
""
)

mkdir -p posts

for title in "${titles[@]}"; do
  filename=$(echo "$title" \
    | tr '[:upper:]' '[:lower:]' \
    | tr -cd '[:alnum:] \n ' \
    | tr ' ' '-' ).md
  filepath="src/posts/$filename"
  touch "$filepath"
  echo "Created $filepath"
done
