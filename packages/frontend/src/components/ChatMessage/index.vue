<script setup lang="ts">
import { watch } from "vue";
import mdi from "./utils";

const props = defineProps<{
  message: {
    role: "user" | "assistant";
    content: string;
  };
}>();
// 解析富文本
const changeVal = (item: { content: string }) => {
  return mdi.render(item.content);
};

watch(
  () => props.message,
  (newVal) => {
    console.log("message", newVal);
  },
  { immediate: true }
);
</script>

<template>
  <div :class="['message', message.role]">
    <div class="avatar">
      <span v-if="message.role === 'user'">user</span>
      <span v-else>avatar</span>
    </div>
    <div class="content">
      <div class="text" v-html="changeVal(message)"></div>
    </div>
  </div>
</template>

<style scoped>
.message {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
}

.message.user {
  flex-direction: row-reverse;
}

.avatar span {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.content {
  max-width: 70%;
  padding: 1rem;
  border-radius: 1rem;
  background: #f0f0f0;
}

.message.assistant .content {
  background: #e3f2fd;
}
</style>
