FROM node:18
WORKDIR /app
COPY . /app
RUN yarn install
EXPOSE 5174
CMD ["yarn", "run", "dev", "--host", "0.0.0.0", "--port", "25001"]

