FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src
COPY .env.example .env.example

RUN npm run build

FROM node:20-alpine
WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package*.json ./
COPY .env.example .env

# Provider als Standard-Command starten. Werte in .env können zur Laufzeit
# per environment overrides ersetzt werden (Docker ENVs gelten für den Prozess).
CMD ["node", "dist/provider.js"]
