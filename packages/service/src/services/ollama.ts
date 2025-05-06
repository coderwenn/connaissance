import axios from "axios";
import { IApiReturn } from "../types/index";

const OLLAMA_API_URL = "http://localhost:11434/api";

interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  message: {
    role: string;
    content: string;
  };
  on: (event: string, callback: (data: any) => void) => void;
}

/**
 * Ollama API 服务类
 */
export class OllamaService {
  static async generate(
    prompt: string,
    onData: (data: any) => void,
    // 默认模型 deepseek-r1:7b
    model: string = "deepseek-r1:7b"
  ): Promise<IApiReturn> {
    try {
      const response = await axios.post<OllamaResponse>(
        `${OLLAMA_API_URL}/generate`,
        {
          model,
          prompt,
          stream: true,
        },
        {
          responseType: "stream",
        }
      );

      response.data.on("data", (chunk: Buffer) => {
        const parsed = JSON.parse(chunk.toString("utf-8"));
        onData(parsed.response);
      });

      return new Promise((resolve) => {
        response.data.on("end", () => {
          resolve({
            mes: 200,
            data: response.data.response,
          });
        });
      });
    } catch (error) {
      console.error("Ollama API error:", error);
      throw new Error("Failed to generate response from Ollama");
    }
  }

  /**
   * 聊天接口
   * */
  static async chat(
    messages: Array<{ role: "user" | "assistant"; content: string }>,
    model: string = "deepseek-r1:7b"
  ): Promise<string> {
    try {
      const response = await axios.post<OllamaResponse>(
        `${OLLAMA_API_URL}/chat`,
        {
          model,
          messages,
          stream: false,
        }
      );

      return response.data.message.content;
    } catch (error) {
      console.error("Ollama API error:", error);
      throw new Error("Failed to get chat response from Ollama");
    }
  }
}
