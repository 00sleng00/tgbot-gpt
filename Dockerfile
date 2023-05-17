FROM node:16-alpine

WORKDIR /app

ENV PORT=3000

EXPOSE $PORT

COPY ./entrypoint.sh /
RUN chmod 0744 /entrypoint.sh
ENTRYPOINT /entrypoint.sh
