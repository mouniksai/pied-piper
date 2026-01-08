FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies 
# (Using npm install instead of ci so we can run prisma generate)
RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client (Critical for our app)
RUN npx prisma generate

# Set Environment
ENV NODE_ENV=production

EXPOSE 4000

# We use a shell command to ensure DB is synced before app starts
CMD ["sh", "-c", "npx prisma db push && node src/index.js"]