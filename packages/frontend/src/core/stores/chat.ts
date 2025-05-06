import axios from "axios";
import { defineStore } from "pinia";
import { fetchEventSource } from "@microsoft/fetch-event-source";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: number;
}

export const useChatStore = defineStore("chat", {
  state: () => ({
    messages: [] as Message[],
    isLoading: false,
    error: null as string | null,
    apiBase: "http://127.0.0.1:3000",
  }),
  actions: {
    async sendMessage(prompt: string) {
      this.isLoading = true;
      this.error = null;

      try {
        // 添加用户消息
        this.addMessage({
          content: prompt,
          role: "user",
        });

        const assistantMessage = this.addMessage({
          content: "",
          role: "assistant",
        });
        fetchEventSource(`${this.apiBase}/ai/generate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
          },
          body: JSON.stringify({ prompt }),
          // 请求回调
          onmessage(e: { data: string }) {
            const chunk = JSON.parse(e.data)?.chunk ?? "";
            console.log(chunk, "chunk");
            assistantMessage.content += chunk.replaceAll(
              new RegExp("<think>|</think>", "g"),
              "  "
            ) as string;
          },
          onerror(error) {
            //返回流报错
            console.info(error);
          },
        });
      } catch (err) {
        this.error = "请求失败，请检查后端服务";
      } finally {
        this.isLoading = false;
      }
    },
    addMessage(message: Omit<Message, "id" | "timestamp">) {
      const newMessage = {
        ...message,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
      };
      this.messages.push(newMessage);
      return this.messages[this.messages.length - 1];
    },
  },
});
