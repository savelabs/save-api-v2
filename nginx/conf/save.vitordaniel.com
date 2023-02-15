server {
  listen 80;
  listen [::]:80;

  server_name save.vitordaniel.com;
  server_tokens off;

  location /.well-known/acme-challenge/ {
    root /var/www/certbot;
  }

  location / {
    return 301 https://save.vitordaniel.com$request_uri;
  }
}

server {
  listen 443 default_server ssl http2;
  listen [::]:443 ssl http2;

  server_name save.vitordanie.com;

  ssl_certificate /etc/nginx/ssl/live/save.vitordaniel.com/fullchain.pem;
  ssl_certificate_key /etc/nginx/ssl/live/save.vitordaniel.com/privkey.pem;
    
  location / {
    proxy_pass http://nodejs:8000;
  }
}
