# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app

# 의존성 설치를 위해 package.json 복사
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# 소스 복사 및 빌드
COPY . .
RUN npm run build

# Stage 2: Production image
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# 프로덕션 의존성 및 빌드 결과 복사
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3001
CMD ["node", "dist/main.js"]
