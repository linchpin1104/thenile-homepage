#!/bin/bash
# Vercel 환경변수 등록 — 보이지 않게 입력 받아 production / preview / development 3환경에 일괄 등록
# 사용: bash scripts/setup-env.sh
set -e

cd "$(dirname "$0")/.."

addEnv() {
  local name=$1
  local prompt=$2
  echo ""
  read -sp "$prompt: " value
  echo ""
  if [ -z "$value" ]; then
    echo "  (skip $name — 빈 값)"
    return
  fi
  for env in production preview development; do
    # 기존 값이 있으면 먼저 제거 (덮어쓰기)
    vercel env rm "$name" "$env" --yes 2>/dev/null || true
    printf "%s" "$value" | vercel env add "$name" "$env" 2>&1 | grep -E "Added|Error" | head -1 | sed "s/^/  [$env] /"
  done
}

echo "─────────────────────────────────────────"
echo "Vercel 환경변수 일괄 등록 (각 키 1회 입력)"
echo "입력 시 글자가 보이지 않습니다 (보안)"
echo "─────────────────────────────────────────"

addEnv "SUPABASE_SERVICE_ROLE_KEY" "SUPABASE_SERVICE_ROLE_KEY (Supabase Settings → API → service_role)"
addEnv "SOLAPI_API_KEY"            "SOLAPI_API_KEY (Solapi 콘솔)"
addEnv "SOLAPI_API_SECRET"         "SOLAPI_API_SECRET (Solapi 콘솔)"
addEnv "ADMIN_PHONE"               "ADMIN_PHONE 010xxxxxxxx (옵션, 빈 값으로 두면 skip)"

echo ""
echo "─────────────────────────────────────────"
echo "✓ 등록 완료. 다음 단계: 재배포"
echo "  vercel --prod  또는 Vercel 대시보드 → Redeploy"
echo "─────────────────────────────────────────"
