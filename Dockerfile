# FROM node:18.17.0
# COPY . .
# RUN npm install
# ENV PORT 3000
# EXPOSE 3000
# CMD [ "npm","start" ]

# FROM node:18.17.0 as builder
# WORKDIR /app
# COPY package.json
# RUN npm install
# COPY . .
# RUN npm run build 

# FROM nginx
# EXPOSE 80
# COPY --from=builder /app/build /usr/share/nginx/html

# Stage 1: Build React App
FROM node:18.17.0 as builder
WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx
EXPOSE 80

# Remove default Nginx page
RUN rm -rf /usr/share/nginx/html/*

# Copy built React app to Nginx HTML directory
COPY --from=builder /app/build /usr/share/nginx/html

