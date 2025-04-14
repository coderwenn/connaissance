import axios from "axios";
import { defineStore } from "pinia";

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
        // debugger;
        // 暂时不支持流式响应，使用普通请求
        const res = await axios.post(`${this.apiBase}/ai/generate`, { prompt });
        if (res) {
          const assistantMessage = this.addMessage({
            content: "",
            role: "assistant",
          });
          assistantMessage.content = res.data.response.data as string;
        }
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
      return newMessage;
    },
  },
});
