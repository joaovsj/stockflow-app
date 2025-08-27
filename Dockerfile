FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
COPY mdb-angular-ui-kit-6.1.0.tgz ./    
RUN npm install
RUN npm install -g @angular/cli
COPY . .
RUN ng build --configuration production

FROM nginx:latest
COPY --from=build app/dist/stockflow-app /usr/share/nginx/html
# copia as configurações customizadas
COPY nginx.conf /etc/nginx/conf.d/default.conf 
EXPOSE 80
# executa o nginx como processo principal
CMD ["nginx", "-g", "daemon off;"]