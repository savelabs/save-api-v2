FROM node:16 as base

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package.json pnpm-lock.yaml ./

RUN npm install pnpm -g
RUN pnpm i
RUN pnpm exec prisma generate

COPY --chown=node:node . .

EXPOSE 8000

FROM base as dev

CMD ["pnpm", "run", "start:dev"]

FROM base as prod

WORKDIR /home/node/app

ENV NODE_ENV production

RUN pnpm build

COPY --chown=node:node . /home/node/app/dist

CMD ["pnpm", "run", "start:prod"]
