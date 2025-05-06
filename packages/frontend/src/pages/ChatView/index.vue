<script setup lang="ts">
import { ref, nextTick } from "vue";
import { useChatStore } from "@/core/stores/chat";
import ChatMessage from "@/components/ChatMessage/index.vue";

const store = useChatStore();
const inputText = ref("");
const chatContainer = ref<HTMLElement>();

const sendMessage = async () => {
  if (!inputText.value.trim() || store.isLoading) return;
  store.sendMessage(inputText.value.trim());
  inputText.value = ""; // 清空输入框
  // 自动滚动到底部
  await nextTick();
  chatContainer.value?.scrollTo({
    top: chatContainer.value.scrollHeight,
    behavior: "smooth",
  });
};
</script>

<template>
  <div class="chat-container">
    <div class="messages" ref="chatContainer">
      <ChatMessage v-for="message in store.messages" :key="message.id" :message="message" />
      <div v-if="store.isLoading" class="loading">
        <div class="dot-flashing"></div>
      </div>
    </div>

    <div class="input-area">
      <textarea v-model="inputText" @keydown.enter.exact.prevent="sendMessage" placeholder="输入你的问题..."></textarea>
      <button @click="sendMessage" :disabled="store.isLoading">
        {{ store.isLoading ? "生成中..." : "发送" }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  max-width: 1200px;
  margin: 0 auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  padding-bottom: 120px;
}

.input-area {
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: 1200px;
  padding: 1rem;
  background: white;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 1rem;
}

textarea {
  flex: 1;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: none;
  min-height: 50px;
}

button {
  padding: 0 2rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.loading {
  padding: 1rem;
  text-align: center;
}

/* 加载动画 */
.dot-flashing {
  position: relative;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #999;
  animation: dot-flashing 1s infinite linear alternate;
}

@keyframes dot-flashing {
  0% {
    opacity: 0.2;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0.2;
  }
}
</style>
