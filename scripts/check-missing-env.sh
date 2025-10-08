#!/bin/bash

# Check which environment variables are missing from Vercel

echo "Checking which environment variables are missing from Vercel..."
echo ""

# Get list of Vercel env vars
vercel_vars=$(vercel env ls 2>/dev/null | awk 'NR>1 {print $1}' | sort -u)

# Get list of local env vars
local_vars=$(grep -E "^[A-Z_]+=" .env.local | cut -d'=' -f1 | sort)

echo "Local variables:"
echo "$local_vars"
echo ""
echo "Missing from Vercel:"

missing_count=0
for var in $local_vars; do
  if ! echo "$vercel_vars" | grep -q "^$var\$"; then
    echo "  ❌ $var"
    missing_count=$((missing_count + 1))
  fi
done

if [ $missing_count -eq 0 ]; then
  echo "  ✅ All variables are already in Vercel!"
else
  echo ""
  echo "Total missing: $missing_count"
fi
