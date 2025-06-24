# 阶段 1: 构建应用程序
FROM node:18-alpine AS builder

# 全局安装 pnpm
RUN npm install -g pnpm

WORKDIR /app

# 复制 pnpm 配置并安装依赖
# 使用 --frozen-lockfile 确保可复现的构建
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 复制其余的应用程序代码
COPY . .

# 构建 Next.js 应用程序
# 使用 CI=true 防止脚本引入的交互式提示
RUN CI=true pnpm run build

# 阶段 2: 创建生产镜像
FROM node:18-alpine AS runner

# 为安全性创建专用的非 root 用户和组
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

WORKDIR /app

ENV NODE_ENV=production
# 如果您想在运行时禁用遥测，请取消注释以下行。
# ENV NEXT_TELEMETRY_DISABLED=1

# 从构建器阶段复制必要的文件，并设置正确的所有权
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# 将用户设置为非 root 用户
USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 启动 Next.js 服务器的命令
CMD ["node", "server.js"]