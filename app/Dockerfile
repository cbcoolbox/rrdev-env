FROM php:7.4-cli

# update then install some needed stuff
RUN apt-get update && apt-get install -y --no-install-recommends \
  wget \
  git \
  vim \
  zlib1g-dev \
  unzip \
  libzip-dev
  
# install php extentions
RUN docker-php-ext-install zip \
  && docker-php-ext-install opcache \
  && docker-php-ext-enable opcache \
  && docker-php-ext-install sockets pdo pdo_mysql 

# nice way to get composer installed
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# get the roadrunner binary and make it executable
ENV ROADRUNNER_VERSION=2.4.2
RUN wget -O rr.tar.gz "https://github.com/spiral/roadrunner-binary/releases/download/v${ROADRUNNER_VERSION}/roadrunner-${ROADRUNNER_VERSION}-linux-amd64.tar.gz" \
    && tar -xzf rr.tar.gz \
    && mv "roadrunner-${ROADRUNNER_VERSION}-linux-amd64/rr" /usr/local/bin/rr \
    && chmod +x /usr/local/bin/rr

# set the work dir to our application root
WORKDIR /app

# need to copy the composer.json file over becuase this is before volumes are accessible...or something?
COPY . .

# installing php libraries
RUN composer install

# entry point to the roadrunner executable to start the server.
ENTRYPOINT ["/usr/local/bin/rr", "serve"]

# nice way to keep the container running then run following command to look around the container 
# docker exec -ti rr_rr-app_1 sh -c "ls"
#ENTRYPOINT ["tail", "-f", "/dev/null"]