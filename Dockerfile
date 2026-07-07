FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat openssl
RUN corepack enable
# Prisma CLI의 postinstall/명령 후 체크포인트(업데이트 확인) 네트워크 콜 비활성화
# — 컨테이너에서 이 호출이 멈추면 `prisma generate`/`migrate deploy` 뒤 프로세스가 종료되지 않음
ENV CHECKPOINT_DISABLE=1

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# prisma generate 후 next build (package.json build 스크립트)
RUN pnpm build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV CHECKPOINT_DISABLE=1
# openssl: Prisma 엔진(linux-musl-openssl-3.0.x) 런타임 의존성
RUN apk add --no-cache openssl
# prisma CLI: 배포 시작 시 migrate deploy 실행용 (railway.json startCommand 참조)
RUN npm install -g prisma@6.19.3
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/scripts ./scripts
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# next/image 최적화(AVIF/WebP)용 sharp.
# standalone 트레이싱이 sharp의 JS는 포함하지만 네이티브 @img/* 바이너리는 누락함.
# in-place `npm install`은 standalone의 pnpm node_modules(심볼릭 구조)와 충돌해 빌드 실패 →
# 격리 디렉터리에서 fresh 설치한 뒤, 완성된 sharp+@img(musl)+런타임 deps를 node_modules로 복사.
RUN mkdir -p /opt/sharp && cd /opt/sharp \
 && npm init -y >/dev/null 2>&1 \
 && npm install sharp@0.33.5 --no-audit --no-fund \
 && rm -rf /app/node_modules/sharp /app/node_modules/@img \
 && cp -R /opt/sharp/node_modules/. /app/node_modules/ \
 && rm -rf /opt/sharp
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
# 마이그레이션 적용 후 서버 시작 (start.sh가 실패/hang에도 서버 부팅 보장)
CMD ["sh", "scripts/start.sh"]
