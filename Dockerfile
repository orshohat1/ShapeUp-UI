FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Builds the app for production
RUN npm run build

FROM nginx:alpine

# Copy built files to nginx's public directory
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# Runs nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
