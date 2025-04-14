<script setup lang="ts">
defineProps<{
  message: {
    role: "user" | "assistant";
    content: string;
  };
}>();
</script>

<template>
  <div :class="['message', message.role]">
    <div class="avatar">
      <span v-if="message.role === 'user'">user</span>
      <span v-else>avatar</span>
    </div>
    <div class="content">
      <div class="text">{{ message.content }}</div>
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
