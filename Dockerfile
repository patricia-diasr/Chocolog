FROM node:18 AS build
WORKDIR /app
ARG EXPO_PUBLIC_API_URL_EXTERNAL
ENV EXPO_PUBLIC_API_URL_EXTERNAL=$EXPO_PUBLIC_API_URL_EXTERNAL
COPY package.json package-lock.json* yarn.lock* ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npx expo export:web
FROM nginx:1.25
COPY --from=build /app/web-build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
