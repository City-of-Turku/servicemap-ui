FROM node:18

# Create app directory
WORKDIR /servicemap-ui

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm install
RUN npm ci --only=production

COPY . .
RUN git clone -b master https://github.com/City-of-Turku/servicemap-ui-turku ./servicemap-ui-turku
RUN npm install ./servicemap-ui-turku
RUN npm run build

# Bundle app source
EXPOSE 2048
CMD [ "node", "dist/index.js" ]
