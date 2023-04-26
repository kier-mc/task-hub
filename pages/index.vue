<template>
  <div class="temp">
    <p>Index page content</p>
    <p v-if="user">User is currently logged in: {{ user.email }}</p>
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

onMounted(() => {
  notifications.setMessage(
    "Test notification to avoid unnecessary server requests",
    "test"
  );
});
</script>
