# Builder stage
FROM node:18.16.0-alpine as builder
# LABELS
LABEL org.opencontainers.image.source https://github.com/__GITHUB_USERNAME__/__SUPABASE_PROJECT_NAME__-core
# Set the working directory
WORKDIR /app
# Copy package files
COPY package.json package-lock.json ./
# Copy typescript config file
COPY tsconfig.json ./
# Install dependencies
RUN npm install
# Copy all other source code files
COPY . .
# Compile typescript
RUN npm run build

# Deploy stage
FROM node:18.16.0-alpine as deploy
# Set the working directory
WORKDIR /app
# Create a non-root user and use it
USER node:node
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json .

# ENV variables
ARG PORT
ARG SUPABASE_URL
ARG SUPABASE_ANON_KEY
ARG HASURA_GRAPHQL_ENDPOINT
ARG HASURA_GRAPHQL_ADMIN_SECRET
ARG ENCRYPTION_KEY

ENV PORT=$PORT
ENV SUPABASE_URL=$SUPABASE_URL
ENV SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
ENV HASURA_GRAPHQL_ENDPOINT=$HASURA_GRAPHQL_ENDPOINT
ENV HASURA_GRAPHQL_ADMIN_SECRET=$HASURA_GRAPHQL_ADMIN_SECRET
ENV ENCRYPTION_KEY=$ENCRYPTION_KEY

# Expose port
EXPOSE $PORT
# Start the app
CMD ["npm", "run", "start"]