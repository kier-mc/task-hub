<template>{{ time }}</template>

<style scoped lang="scss"></style>

<script setup lang="ts">
// Pinia
const userStore = useUserStore();

// Reactive variables
const timestamp = useNow();

// Computed properties
const time = computed(() => {
  const locale = userStore.getPreferredLocaleFormatting ?? "GB";
  const options: Intl.DateTimeFormatOptions = { timeStyle: "medium" };
  return timestamp.value.toLocaleTimeString(locale, options);
});

// Hooks
onMounted(() => {
  if (!userStore.response) userStore.fetchData();
});
</script>
