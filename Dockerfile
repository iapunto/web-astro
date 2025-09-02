
# 1. Base Image
FROM node:18-slim

# 2. Install Dependencies for node-gyp
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ openssl

# 3. Set Working Directory
WORKDIR /app

# 4. Install pnpm
RUN npm install -g pnpm

# 5. Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml* ./

# 6. Install Dependencies
RUN pnpm install --frozen-lockfile

# 7. Copy the rest of the application
COPY . .

# 8. Build the application
RUN pnpm run build

# 9. Expose the port
EXPOSE 3000

# 10. Set the start command
CMD ["pnpm", "start"]
