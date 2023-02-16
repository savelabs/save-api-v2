FROM node:16 as base

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package.json pnpm-lock.yaml ./

RUN npm install pnpm -g
RUN pnpm i

COPY --chown=node:node . .

RUN pnpm exec prisma generate
RUN pnpm build

EXPOSE 8000

FROM base as dev

CMD ["pnpm", "run", "start:dev"]

FROM base as prod

ENV NODE_ENV production

WORKDIR /home/node/app

COPY package.json pnpm-lock.yaml ./

RUN pnpm i

COPY . .

COPY --from=base /home/node/app/dist ./dist

CMD ["pnpm", "run", "start:prod"]
