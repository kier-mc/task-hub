<template>
  <div class="temp">
    <p>Index page content</p>
    <p v-if="user">User is currently logged in: {{ user.email }}</p>
    <br />
    <p>
      <button
        class="button"
        type="button"
        @click="notifications.push('Notification', 'A message')"
      >
        Trigger Notification
      </button>
      <br />
      <br />
      <button
        class="button"
        type="button"
        @click="notifications.push('Notification', 'Another message')"
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
.temp-divider {
  margin-top: 3rem;
}
</style>

<script setup lang="ts">
const user = useSupabaseUser();
const notifications = useNotificationsStore();
</script>
