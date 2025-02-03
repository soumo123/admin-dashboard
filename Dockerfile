FROM node:18.17.0
COPY . .
RUN npm install
ENV PORT 3000
EXPOSE 3000
CMD [ "npm","start" ]
