# Build stage
FROM node:20 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Declare build time arguments
ARG VITE_CLIENT_URL
ARG VITE_BACKEND_URL
ARG VITE_CHAT_SERVER_URL

# Set env vars from args
ENV VITE_CLIENT_URL=$VITE_CLIENT_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_CHAT_SERVER_URL=$VITE_CHAT_SERVER_URL

RUN npm run build

# Serve with nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY ssl/self-signed.crt /etc/nginx/ssl/self-signed.crt
COPY ssl/self-signed.key /etc/nginx/ssl/self-signed.key

EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
