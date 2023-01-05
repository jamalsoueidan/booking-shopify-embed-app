FROM node:18-alpine

ARG SHOPIFY_API_KEY
ENV SHOPIFY_API_KEY=$SHOPIFY_API_KEY
EXPOSE 8081
WORKDIR /app
COPY shopify-embed-app .
RUN npm install
RUN cd frontend && npm install && npm run build
CMD ["npm", "run", "serve"]
