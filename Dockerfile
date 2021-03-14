FROM node

RUN mkdir -p /kag-propagate-bans
WORKDIR /kag-propagate-bans

RUN npm install -g typescript

COPY . .
RUN npm install
RUN npm run-script compile

CMD ["npm", "run-script", "run"]