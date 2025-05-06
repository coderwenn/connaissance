import { Context } from "koa";
import { OllamaService } from "../services/ollama";

export class AIController {
  static async generateText(ctx: Context) {
    const { prompt } = ctx.request.body as { prompt: string };

    if (!prompt) {
      ctx.status = 400;
      ctx.body = { error: "Prompt is required" };
      return;
    }
    try {
      ctx.set({
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      });
      await OllamaService.generate(prompt, (chunk: any) => {
        ctx.res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
      });
      ctx.res.end();
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: "Failed to generate text" };
    }
  }

  static async chat(ctx: Context) {
    const { messages } = ctx.request.body as {
      messages: Array<{ role: string; content: string }>;
    };

    if (!messages || !Array.isArray(messages)) {
      ctx.status = 400;
      ctx.body = { error: "Messages array is required" };
      return;
    }

    try {
      const response = await OllamaService.chat(messages as any);
      ctx.body = { response };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: "Failed to get chat response" };
    }
  }
}
