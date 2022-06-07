FROM node:14-alpine as builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production
RUN npm install -g @vercel/ncc
COPY . .
RUN npm run build

FROM node:14-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist ./dist
RUN mkdir -p /usr/src/app/temp
EXPOSE 5000
CMD ["node", "dist/index.js"]
