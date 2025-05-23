FROM node:20 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine

# Copy build output
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy SSL certs
COPY ssl/self-signed.crt /etc/nginx/ssl/self-signed.crt
COPY ssl/self-signed.key /etc/nginx/ssl/self-signed.key

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]