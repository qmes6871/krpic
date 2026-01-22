#!/bin/bash

# Usage: ./fetch-image.sh "keyword" "output_filename" [orientation]
# Example: ./fetch-image.sh "minimal office" "hero.jpg" landscape

KEYWORD="$1"
OUTPUT="$2"
ORIENTATION="${3:-landscape}"

if [ -z "$KEYWORD" ] || [ -z "$OUTPUT" ]; then
    echo "Usage: $0 <keyword> <output_filename> [orientation]"
    exit 1
fi

# Convert spaces to commas for URL
QUERY=$(echo "$KEYWORD" | tr ' ' ',')

# Unsplash Source API
if [ "$ORIENTATION" = "portrait" ]; then
    URL="https://source.unsplash.com/random/1080x1920/?${QUERY}"
elif [ "$ORIENTATION" = "square" ]; then
    URL="https://source.unsplash.com/random/1080x1080/?${QUERY}"
else
    URL="https://source.unsplash.com/random/1920x1080/?${QUERY}"
fi

echo "Fetching image for: $KEYWORD"
echo "URL: $URL"
curl -L -s -o "$OUTPUT" "$URL"
echo "Saved to: $OUTPUT ($(stat -f%z "$OUTPUT" 2>/dev/null || stat -c%s "$OUTPUT") bytes)"
