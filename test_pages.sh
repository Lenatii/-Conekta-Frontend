#!/bin/bash
BASE_URL="https://3000-ip2twqzivnkf7qufg1246-fa58d6dd.manusvm.computer"
PAGES=("/" "/properties" "/fundis" "/stays" "/verify" "/terms" "/privacy")

echo "Testing all pages for 404 errors..."
for page in "${PAGES[@]}"; do
  status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$page")
  if [ "$status" = "200" ]; then
    echo "✅ $page - OK ($status)"
  else
    echo "❌ $page - FAILED ($status)"
  fi
done
