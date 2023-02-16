#* BUILD FOR LOCAL DEVELOPMENT

FROM node:18 AS dev
RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

WORKDIR /usr/src/app

COPY --chown=node:node pnpm-lock.yaml ./

RUN pnpm fetch --prod

COPY --chown=node:node . .
RUN pnpm install

USER node

EXPOSE 8000

CMD ["pnpm", "start:dev"]

#* BUILD FOR PRODUCTION

FROM node:18 AS build
RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

WORKDIR /usr/src/app

COPY --chown=node:node pnpm-lock.yaml ./

COPY --chown=node:node --from=dev /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN pnpm exec prisma generate
RUN pnpm build

ENV NODE_ENV production

RUN pnpm install --prod

USER node

#* PRODUCTION

FROM node:18 AS prod

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

RUN npm i -g pm2

CMD [ "pm2", "start", "dist/src/main.js", "-i", "max" ]
