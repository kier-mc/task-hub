<template>
  <div class="container">
    <div class="day">{{ day }}</div>
    <div class="date">{{ date }}</div>
  </div>
</template>

<style scoped lang="scss">
@use "../assets/scss/data/fontsize";
.day {
  font-size: fontsize.$xxxl;
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

// Hooks
onMounted(() => {
  if (!userStore.response) userStore.fetchData();
});
</script>
