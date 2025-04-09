#!/bin/sh
# Iniciamos el servidor SSR en segundo plano
node dist/heroes-app/server/main.js &

# Iniciamos Nginx
nginx -g "daemon off;"