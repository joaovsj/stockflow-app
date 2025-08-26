FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install -g @angular/cli
COPY . .
RUN ng build --prod

FROM nginx:latest
COPY --from=build app/dist/stockflow-app /usr/share/nginx/html
# copia as configurações customizadas
COPY nginx.conf /etc/nginx/conf.d/default.conf 
EXPOSE 80
# executa o nginx como processo principal
CMD ["nginx", "-g", "daemon off;"]