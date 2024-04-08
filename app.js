var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
var router = require("./routes/index");
const cors = require("cors");

var app = express();
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:9000",
  })
);
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(
  session({
    secret: "lrx",
    // name: 'c-s',
    // rolling: true,
    // cookie: { maxAge: 6000000  },
    // cookie: { secure: false },
    // resave: false,
    saveUninitialized: true,
    // unset: "destroy", // 在每次会话就熟后销毁 session
    resave: false,
    // saveUninitialized: false,
    // rolling: true,
    // cookie: {
    //   // maxAge: 60 * 60 * 1000, // session ID 有效时间
    // },
    cookie: { secure: false } // 可以根据需要进行配置
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


app.use("/api", router);

// catch 404 and forward to error handler
// 捕获 404 并转发到错误处理程序
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
//全局错误处理
app.use(function (err, req, res, next) {
  // // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get("env") === "development" ? err : {};
  // console.log(35, res.locals);
  // // render the error page
  // res.status(err.status || 500);
  // res.render("error");
  console.error(37, err.stack);
  console.error(38, err.data);
  const statusCode = err.statusCode || 500;
  const message = err.message || "服务器错误";
  const data = err.data || null;

  if (statusCode === 404) {
    res.status(statusCode).json({
      code: statusCode,
      msg: "Not Found",
      data: null,
    });
  } else {
    res.status(statusCode).json({
      code: statusCode,
      msg: message,
      data: data,
    });
  }
});

module.exports = app;
