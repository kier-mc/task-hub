<template>
  <div class="view-task">
    <!-- BUTTONS FOR DEVELOPMENT/DEBUGGING ONLY -->
    <!-- <button
      type="button"
      class="button"
      @click="taskStore.getTasks()"
      style="margin-right: 1rem"
    >
      Fetch Tasks
    </button>
    <button type="button" class="button" @click="taskStore.clearTasks()">
      Clear Tasks
    </button> -->
    <!-- TASKS -->
    <template v-if="!taskStore.taskCount()"> No tasks found </template>
    <template v-else>
      <div class="tasks" v-for="(task, index) in taskStore.tasks" :key="index">
        <CompTask :data="task" />
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
  taskStore.getTasks();
});
</script>
