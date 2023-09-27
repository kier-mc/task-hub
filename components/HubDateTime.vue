<template>
  <div class="container">
    <ClientOnly>
      <div class="day">{{ day }}</div>
      <div class="date">{{ date }} at {{ time }}</div>
    </ClientOnly>
  </div>
</template>

<style scoped lang="scss">
@use "../assets/scss/data/fontsize";
.day {
  font-size: fontsize.$xl;
}
.date {
  font-size: fontsize.$sm;
}
</style>

<script setup lang="ts">
// Pinia
const userStore = useUserStore();

// Reactive variables
const timestamp = useNow();

// Computed properties
const day = computed(() => {
  const locale = userStore.getPreferredLocaleFormatting ?? "GB";
  const options: Intl.DateTimeFormatOptions = { weekday: "long" };
  return timestamp.value.toLocaleDateString(locale, options);
});

const date = computed(() => {
  const locale = userStore.getPreferredLocaleFormatting ?? "GB";
  return timestamp.value.toLocaleDateString(locale);
});

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
