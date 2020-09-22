# stage 1

FROM node:alpine AS my-app-build
ARG build_type=production
WORKDIR /app
COPY . .
RUN npm install -g @angular/cli
RUN npm ci && ng build --aot --configuration=${build_type}

# stage 2

FROM nginx:alpine
COPY --from=my-app-build /app/dist /usr/share/nginx/html
EXPOSE 80
