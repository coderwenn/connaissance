import Koa from "koa";
import bodyParser from "koa-bodyparser";
import router from "./routes";
import { logger } from "./middlewares/logger";
// 跨域资源共享
import cors from "@koa/cors";

const app = new Koa();

// 中间件
app.use(bodyParser());
// 日志
app.use(logger);

// 跨域资源共享
app.use(
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

// 路由
app.use(router.routes()).use(router.allowedMethods());

// 错误处理
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});

export default app;
