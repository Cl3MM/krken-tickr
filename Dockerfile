FROM node:6.10-alpine

MAINTAINER Cl3MM

ENV APP_PATH=/data

WORKDIR $APP_PATH

COPY package.json /tmp
COPY crontab /tmp

RUN \
      cd /tmp \
      && npm install \
      && cp -a /tmp/node_modules ${APP_PATH}/ \
      && crontab /tmp/crontab \
      && rm -rf /tmp/* \
      && touch /var/log/cron.log \
      && mkdir -p $APP_PATH \
      && apk --update --no-cache add tzdata \
      && cp /usr/share/zoneinfo/Europe/Paris /etc/localtime \
      && echo "Europe/Paris" >  /etc/timezone \
      && apk del tzdata \
      && rm -rf /var/cache/apk/* \
      && npm install -g node-inspector

COPY . $APP_PATH

VOLUME $APP_PATH

EXPOSE 3000

CMD ["node", "-v"]
