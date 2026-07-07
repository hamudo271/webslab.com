#!/bin/sh
# Railway 컨테이너 시작 스크립트.
# 목적: DB 마이그레이션을 적용하되, 그 단계가 무슨 일이 있어도 Next 서버 부팅을 막지 못하게 한다.
# 배경: `prisma migrate deploy && node server.js`를 startCommand에 직접 넣으면
#   (1) Railway가 셸 없이 exec할 때 `&&`가 prisma 인자로 먹히거나
#   (2) alpine 글로벌 prisma가 마이그레이션 성공 후에도 프로세스를 종료하지 않고 hang 하면
#   node server.js 로 넘어가지 못해 헬스체크가 타임아웃난다.
# 아래는 셸에서 실행되고, 실패/타임아웃해도 반드시 서버로 넘어가며, 로그로 어느 단계였는지 남긴다.

echo "[start] prisma migrate deploy 시작..."
if timeout 60 prisma migrate deploy; then
  echo "[start] 마이그레이션 완료"
else
  echo "[start] 마이그레이션 실패 또는 타임아웃 (exit=$?) — 서버는 계속 시작"
fi

echo "[start] Next.js 서버 시작 (node server.js)"
exec node server.js
