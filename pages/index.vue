<template>
  <div class="temp">
    <p>Index page content</p>
    <p v-if="user">User is currently logged in: {{ user.email }}</p>
    <br />
    <p>
      <button
        class="button"
        type="button"
        @click="notifications.setMessage('A message', 'dev')"
      >
        Trigger Notification
      </button>
      <br />
      <br />
      <button
        class="button"
        type="button"
        @click="notifications.setMessage('Another message', 'dev')"
      >
        Trigger Separate Notification
      </button>
    </p>
  </div>
</template>

<style scoped lang="scss">
.temp {
  padding: 1rem;
  background-color: hsl(0, 0%, 17.5%);
}
</style>

<script setup lang="ts">
const user = useSupabaseUser();
const notifications = useNotificationsStore();
</script>
