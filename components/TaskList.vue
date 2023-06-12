<template>
  <div class="view-task">
    <template v-if="!taskStore.taskCount()"> No tasks found </template>
    <template v-else>
      <div class="tasks" v-for="(task, index) in taskStore.tasks" :key="index">
        <TaskItem :taskData="task" />
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.tasks {
  &:not(:last-child) {
    margin-bottom: 1rem;
  }
}
</style>

<script setup lang="ts">
const taskStore = useTaskStore();
onMounted(async () => {
  if (!taskStore.tasks) await taskStore.getTasks();
});
</script>
