<!-- 
    Elements are currently editable, but the backend functionality needs to be handled
    Consider an edit button, perhaps top right of the task, that allows editability to be enabled
    Frequency would likely work best as a <select> element
-->
<template>
  <div class="task" ref="container">
    <div class="task__title">
      <h3
        contenteditable="true"
        @input="
          updateTask(
            'task',
            ($event.target as HTMLHeadingElement).textContent ?? ''
          )
        "
      >
        {{ data.task }}
      </h3>
    </div>
    <div
      class="task__description"
      contenteditable="true"
      @input="
        updateTask(
          'description',
          ($event.target as HTMLDivElement).textContent ?? ''
        )
      "
    >
      {{ data.description }}
    </div>
    <div class="task__frequency">
      {{ frequencies[(data as Database["tasks"]).frequency_id] }}
    </div>
    {{ task }}
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
  &--edited {
    border: 1px solid hsl(10, 50%, 50%);
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
const container: Ref<HTMLDivElement | null> = ref(null);
const task = reactive({
  task: "",
  description: "",
  frequency: "",
});
function updateTask(prop: "task" | "description" | "frequency", value: string) {
  task[prop] = value;
}
function isTaskEdited() {
  if (!container.value) return;
  if (
    task.task !== props.data.task ||
    task.description !== props.data.description ||
    task.frequency !== frequencies[props.data.frequency_id]
  ) {
    container.value.classList.add("task--edited");
  } else {
    container.value.classList.remove("task--edited");
  }
}
onMounted(() => {
  task.task = props.data.task;
  task.description = props.data.description;
  task.frequency = frequencies[props.data.frequency_id];
});
onUpdated(() => {
  isTaskEdited();
});
</script>
