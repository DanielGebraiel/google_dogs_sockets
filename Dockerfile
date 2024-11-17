FROM node:16.14.0-alpine
WORKDIR "/app"
COPY package*.json ./
RUN npm install
RUN npm install socket.io 
RUN npm install -g nodemon
COPY . .
EXPOSE 5000
CMD ["npm", "run", "start"]