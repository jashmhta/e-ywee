#!/bin/bash
# Download product images from Amazon India
IMG_DIR="/home/ubuntu/y1/e-ywee/client/public/images"
mkdir -p "$IMG_DIR"

UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

download_amazon_image() {
  local asin="$1"
  local outfile="$2"

  local html
  html=$(curl -s -L -A "$UA" "https://www.amazon.in/dp/${asin}" 2>/dev/null)
  local img_id
  img_id=$(echo "$html" | grep -oP 'https://m\.media-amazon\.com/images/I/[^"'"'"']+\._SX\d+_' | head -1 | grep -oP 'images/I/[^.]+' | sed 's|images/I/||')

  if [ -z "$img_id" ]; then
    echo "  WARN: No image found for $asin"
    return 1
  fi

  local img_url="https://m.media-amazon.com/images/I/${img_id}._SX679_.jpg"
  curl -s -L -A "$UA" -o "$IMG_DIR/$outfile" "$img_url"

  if [ -f "$IMG_DIR/$outfile" ] && [ "$(stat -c%s "$IMG_DIR/$outfile")" -gt 100 ]; then
    echo "  OK: $outfile ($(stat -c%s "$IMG_DIR/$outfile") bytes)"
    return 0
  else
    rm -f "$IMG_DIR/$outfile"
    echo "  FAIL: $outfile"
    return 1
  fi
}

ASINS=("B0FL16ZFCH" "B0FL1686TQ" "B0FL142X65" "B0FL2TGBKD" "B0FL2X7BKK" "B0FL2XB7Q5" "B0FKXWTSMZ" "B0FL16F1NK" "B0FL2XM93X" "B0FKYL7KWP" "B0FLDYQKVB" "B0FKH6XYS1")

SUCCESS=0
FAIL=0

for asin in "${ASINS[@]}"; do
  echo "[$asin]"
  if download_amazon_image "$asin" "${asin}_main.jpg"; then
    SUCCESS=$((SUCCESS + 1))
  else
    FAIL=$((FAIL + 1))
  fi
  sleep 2
done

echo ""
echo "Downloaded: $SUCCESS, Failed: $FAIL"

# Create variant copies
echo "Creating variant copies..."

copy_main() {
  local asin="$1"
  local target="$2"
  if [ -f "$IMG_DIR/${asin}_main.jpg" ]; then
    cp "$IMG_DIR/${asin}_main.jpg" "$IMG_DIR/$target"
    echo "  cp -> $target"
  fi
}

copy_main "B0FL16ZFCH" "B0FL16ZFCH_0_d6e7b3ae.jpg"
copy_main "B0FL1686TQ" "B0FL1686TQ_0_549c4679.jpg"
copy_main "B0FL142X65" "B0FL142X65_0_3f11930b.jpg"
copy_main "B0FL2TGBKD" "B0FL2TGBKD_0_1c40bf54.jpg"
copy_main "B0FL2X7BKK" "B0FL2X7BKK_0_f0a46cd4.jpg"
copy_main "B0FKXWTSMZ" "B0FKXWTSMZ_0_8df6310e.jpg"
copy_main "B0FL16F1NK" "B0FL16F1NK_0_b30f8615.jpg"
copy_main "B0FKYL7KWP" "B0FKYL7KWP_0_9c3fc724.jpg"
copy_main "B0FKH6XYS1" "B0FKH6XYS1_0_6767152a.jpg"
copy_main "B0FL2XB7Q5" "B0FL2XB7Q5_0_c40a9cb3.jpg"
copy_main "B0FL2XB7Q5" "B0FL2XB7Q5_1_a85db41b.jpg"
copy_main "B0FL2XB7Q5" "B0FL2XB7Q5_2_16c09505.jpg"
copy_main "B0FL2XM93X" "B0FL2XM93X_0_5e9b0321.jpg"
copy_main "B0FL2XM93X" "B0FL2XM93X_1_84b65396.jpg"
copy_main "B0FL2XM93X" "B0FL2XM93X_2_247106dc.jpg"
copy_main "B0FLDYQKVB" "B0FLDYQKVB_0_1fd8a582.jpg"
copy_main "B0FLDYQKVB" "B0FLDYQKVB_1_9087b6f2.jpg"

echo ""
echo "Total files:"
ls "$IMG_DIR" | wc -l
