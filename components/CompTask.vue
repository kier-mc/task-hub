<template>
  <div class="task">
    <div class="task__title">
      <h3>{{ data.task }}</h3>
    </div>
    <div class="task__description">
      {{ data.description }}
    </div>
    <div class="task__frequency">
      {{ frequencies[(data as Database["tasks"]).frequency_id] }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.task {
  max-width: 50ch;
  border: 1px solid hsl(0, 0%, 30%);
  border-radius: 0.5rem;
  background-color: hsl(0, 0%, 15%);
  &__title,
  &__description,
  &__frequency {
    padding: 0.5rem;
  }
  &__title {
    border-radius: 0.5rem 0.5rem 0 0;
    background-color: hsl(0, 0%, 10%);
    font-size: 1.05rem;
  }
  &__description {
    font-size: 0.9rem;
  }
  &__frequency {
    text-align: right;
    font-size: 0.9rem;
  }
}
</style>

<script setup lang="ts">
const props = defineProps({
  data: { type: Object as PropType<Database["tasks"]>, required: true },
});
const frequencies: { [key: number]: string } = {
  1: "Daily",
  2: "Weekly",
  3: "Fortnightly",
  4: "Monthly",
  5: "Every three months",
  6: "Every six months",
  7: "Once a year",
};
</script>
