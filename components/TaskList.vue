<template>
  <section class="task-list">
    <section v-if="!props.data.length" class="task-list__empty">
      No tasks found
    </section>
    <section v-else class="task-list__list">
      <TaskItem v-for="(task, index) in props.data" :data="task" :key="index" />
    </section>
  </section>
</template>

<style scoped lang="scss">
@use "../assets/scss/data/colour";
.task-list {
  &__empty {
    color: colour.$font-light;
  }
}
</style>

<script setup lang="ts">
import type { TaskData } from "~/types/components/tasks";

const props = defineProps({
  data: { type: Array as PropType<TaskData[]>, required: true },
});
</script>
