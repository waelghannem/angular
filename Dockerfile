FROM node:19-alpine

RUN npm config set strict-ssl false

# get the app
WORKDIR /src
COPY . .
COPY src/assets/config/environment.template.json src/assets/config/environment.json
COPY entrypoint.sh /
# install packages
RUN npm ci
RUN npm install -g @angular/cli
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["ng serve --host 0.0.0.0 --disable-host-check"]

