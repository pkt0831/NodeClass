const http = require("http");
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const helmet = require("helmet");

const mainRouter = require("./router/mainRouter");
const userRouter = require("./router/userRouter");

const db = require("./model/db");

class AppServer extends http.Server {
  constructor(config) {
    const app = express();
    super(app);
    this.config = config;
    this.app = app;

    //동시성 처리를 위한 준비 코드인데, 후반부에 설명이 들어갑니다.
    this.currentConns = new Set();
    this.busy = new WeakSet();
    this.stop = false;
  }
  start() {
    this.set();
    this.middleWare();
    this.router();
    this.dbConnection();
    return this;
    // this.app.engine("html", require("ejs").renderFile);
    // this.app.set("views", __dirname + "/views");
    // this.app.set("view engine", "html");

    // this.app.use("/public", express.static(__dirname + "/public"));

    // this.app.use(helmet());
    // this.app.use(bodyParser());
    // this.app.use(cookieParser());
    // this.app.use((req, res, next) => {
    //   console.log("미들웨어");
    //   next();
    // });
    // this.app.use("/", mainRouter);
    // this.app.use("/user", userRouter);

    // this.app.use((req, res, next) => {
    //   res.status(404);
    //   res.send("잘못된 요청입니다");
    // });

    return this;
  }
  set() {
    this.app.engine("html", require("ejs").renderFile);
    this.app.set("views", __dirname + "/views");
    this.app.set("view engine", "html");
    this.app.use("/public", express.static(__dirname + "/public"));
  }
  middleWare() {
    this.app.use(helmet());
    this.app.use(bodyParser());
    this.app.use(cookieParser());
    this.app.use((req, res, next) => {
      console.log("미들웨어");
      next();
    });
  }
  router() {
    this.app.use("/", mainRouter);
    this.app.use("/user", userRouter);

    this.app.use((req, res, next) => {
      res.status(404);
      res.send("잘못된 요청입니다");
    });
  }
  dbConnection() {
    db.sequelize
      .authenticate()
      .then(() => {
        console.log("디비 접속 완료");
        return db.sequelize.sync({ force: false });
      })
      .then(() => {
        console.log("디비 접속 완료된 다음 할 일");
      })
      .catch((err) => {
        console.log("디비접속이 실패했을 경우");
        console.log(err);
      });
  }
}

const createServer = (config = {}) => {
  const server = new AppServer();
  return server.start();
};

exports.createServer = createServer;
