# Step 1: Base image
FROM node:20-alpine

# Step 2: Working directory
WORKDIR /app

# Step 3: Copy dependency files FIRST (for layer caching)
COPY package*.json ./

# Step 4: Install production dependencies
RUN npm ci --only=production

# Step 5: Copy Prisma schema
COPY prisma ./prisma/

# Step 6: Generate Prisma client
RUN npx prisma generate

# Step 7: Copy remaining source
COPY . .

# Step 8: Expose port
EXPOSE 3000

# Step 9: Start command
CMD ["node", "src/server.js"]
