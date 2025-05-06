import Router from "koa-router";
import { AIController } from "../controllers/ai.controller";

const router = new Router();

// AI相关路由
router.post("/ai/generate", AIController.generateText);
router.post("/ai/chat", AIController.chat);

// 原有路由保持不变
router.get("/", async (ctx) => {
  ctx.body = { message: "Hello Koa with TypeScript and Ollama!" };
});

router.get("/health", async (ctx) => {
  ctx.body = { status: "OK" };
});

export default router;
