# Usando apenas a imagem final do Swagger UI
FROM swaggerapi/swagger-ui
USER root
COPY ./src/swagger.yaml /usr/share/nginx/html/swagger.yaml
ENV PORT 80
ENV URLS "[{url: 'swagger.yaml', name: 'API Salão Leila'}]"
EXPOSE 80