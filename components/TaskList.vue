<template>
  <div class="view-task">
    <div v-if="isLoading" class="view-task__loading">
      <AppLoadingIndicator :options="propData.loadingIndicator" />
    </div>
    <template v-else>
      <template v-if="!taskStore.taskCount()">No tasks found!</template>
      <template v-else>
        <div
          class="view-task__tasks"
          v-for="(task, index) in taskStore.tasks"
          :key="index"
        >
          <TaskItem :taskData="task" />
        </div>
      </template>
    </template>
  </div>
</template>

<style scoped lang="scss">
.view-task {
  &__loading {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__tasks {
    &:not(:last-child) {
      margin-bottom: 1.5rem;
    }
  }
}
</style>

<script setup lang="ts">
/* Pinia stores */
const taskStore = useTaskStore();
/* Prop data */
const propData = {
  loadingIndicator: {
    type: "dots",
    width: 48,
    height: 48,
    hue: 0,
    saturation: 0,
    lightness: 100,
  } as LoadingIndicatorData,
};
/* Reactive variables */
const isLoading: Ref<boolean> = ref(true);
onMounted(async () => {
  if (!taskStore.taskCount()) await taskStore.getTasks();
  isLoading.value = false;
});
</script>
