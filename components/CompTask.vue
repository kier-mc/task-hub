<!-- 
    Elements are currently editable, but the backend functionality needs to be handled
    Consider an edit button, perhaps top right of the task, that allows editability to be enabled
    Frequency would likely work best as a <select> element
-->
<template>
  <div class="task" ref="container">
    <div class="task__title">
      <h3
        :contenteditable="isEditable ? 'true' : 'false'"
        @input="
          updateTaskLocally(
            'task',
            ($event.target as HTMLHeadingElement).textContent ?? ''
          )
        "
      >
        {{ data.task }}
      </h3>
      <button
        type="button"
        :class="isEditable ? 'task__button--editable' : 'task__button'"
        @click="toggleEditMode"
      ></button>
    </div>
    <div
      class="task__description"
      :contenteditable="isEditable ? 'true' : 'false'"
      @input="
        updateTaskLocally(
          'description',
          ($event.target as HTMLDivElement).textContent ?? ''
        )
      "
    >
      {{ data.description }}
    </div>
    <div class="task__frequency">
      <template v-if="!isEditable">{{
        frequencies[(data as Database["tasks"]).frequency_id]
      }}</template>
      <template v-else>
        <CompFormHandler :formData="propData" v-model="task['frequency']" />
      </template>
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
    display: flex;
    justify-content: space-between;
    border-radius: 0.5rem 0.5rem 0 0;
    background-color: hsl(0, 0%, 10%);
    font-size: 1.05rem;
  }
  &__button {
    all: unset;
    aspect-ratio: 1/1;
    min-width: 24px;
    mask: url("/img/svg/edit.svg") no-repeat center center;
    mask-size: cover;
    -webkit-mask: url("/img/svg/edit.svg") no-repeat center center;
    -webkit-mask-size: cover;
    background-color: hsl(0, 0%, 50%);
    background-repeat: no-repeat;
    background-position: center;
    cursor: pointer;
    &--editable {
      all: unset;
      aspect-ratio: 1/1;
      min-width: 24px;
      mask: url("/img/svg/save.svg") no-repeat center center;
      mask-size: cover;
      -webkit-mask: url("/img/svg/save.svg") no-repeat center center;
      -webkit-mask-size: cover;
      background-color: hsl(0, 0%, 80%);
      background-repeat: no-repeat;
      background-position: center;
      cursor: pointer;
    }
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
const propData: CompFormObject = {
  index: 0,
  formID: "frequency",
  elementType: "select",
  labelText: "Frequency",
  options: [
    { value: "daily", text: "Daily" },
    { value: "weekly", text: "Weekly" },
    { value: "fortnightly", text: "Fortnightly" },
    { value: "monthly", text: "Monthly" },
    { value: "tri-annually", text: "Tri-annually (3 months)" },
    { value: "semi-annually", text: "Semi-annually (6 months)" },
    { value: "annually", text: "Annually" },
  ],
};
const frequencies: { [key: number]: string } = {
  1: "daily",
  2: "weekly",
  3: "fortnightly",
  4: "monthly",
  5: "tri-annually",
  6: "semi-annually",
  7: "annually",
};
const frequencyToID: { [key: string]: number } = {
  daily: 1,
  weekly: 2,
  fortnightly: 3,
  monthly: 4,
  "tri-annually": 5,
  "semi-annually": 6,
  annually: 7,
};
const container: Ref<HTMLDivElement | null> = ref(null);
const task = reactive({
  task: "",
  description: "",
  frequency: "",
});
function updateTaskLocally(
  prop: "task" | "description" | "frequency",
  value: string
) {
  task[prop] = value;
}
const notificationsStore = useNotificationsStore();
const hasBeenEdited: Ref<boolean> = ref(false);
const isEditable: Ref<boolean> = ref(false);
function handleEdit() {
  if (!container.value) return;
  if (
    task.task !== props.data.task ||
    task.description !== props.data.description ||
    task.frequency !== frequencies[props.data.frequency_id]
  ) {
    hasBeenEdited.value = true;
    container.value.classList.add("task--edited");
  } else {
    hasBeenEdited.value = false;
    container.value.classList.remove("task--edited");
  }
}
function toggleEditMode() {
  isEditable.value = !isEditable.value;
  if (hasBeenEdited.value) {
    updateTask();
  }
}
async function updateTask() {
  if (!container.value) return;
  const { data, error } = await useSupabaseClient<Database>()
    .from("tasks")
    .update({
      task: task.task,
      description: task.description,
      frequency_id: frequencyToID[task.frequency],
    })
    .eq("task_id", props.data.task_id);
  if (error) {
    notificationsStore.setMessage(error.message, "error");
    return;
  }
  notificationsStore.setMessage(
    `Task "${task.task}" updated successfully`,
    "success"
  );
  hasBeenEdited.value = false;
  container.value.classList.remove("task--edited");
}
onMounted(() => {
  task.task = props.data.task;
  task.description = props.data.description;
  task.frequency = frequencies[props.data.frequency_id];
});
onUpdated(() => {
  handleEdit();
});
</script>
