FROM node:slim
RUN apt update && apt install -y
WORKDIR /app/backend
COPY ./backend/ ./
WORKDIR /app/frontend
COPY ./frontend/ ./
ENV REACT_APP_PROXY_HOST=http://serwer:5000
RUN npm install
RUN CI=false npm run build
RUN cp -r /app/frontend/build /app/backend/build
WORKDIR /app/backend
RUN npm install
EXPOSE 5000
CMD ["node","app.js"]