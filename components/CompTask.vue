<template>
  <div class="task">
    <h3>{{ data.task }}</h3>
    {{ data.description }}
    <br />
    <br />
    <span style="font-size: 0.8rem">
      Frequency:
      {{ frequencies[(data as Database["tasks"]).frequency_id] }}
    </span>
  </div>
</template>

<style scoped lang="scss"></style>

<script setup lang="ts">
const props = defineProps({
  data: { type: Object as PropType<Database["tasks"]>, required: true },
});
const frequencies: { [key: number]: string } = {
  1: "daily",
  2: "weekly",
  3: "fortnightly",
  4: "monthly",
  5: "tri-annually",
  6: "semi-annually",
  7: "annually",
};
</script>
