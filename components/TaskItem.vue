<template>
  <div class="task" :class="{ 'task--edited': hasBeenEditedLocally }">
    <div class="modal" :class="{ 'modal--visible': modalVisible }">
      <div class="modal__message">
        Are you sure you want to delete this task?
      </div>
      <div class="modal__options">
        <button class="button modal__button" @click="modalVisible = false">
          Cancel
        </button>
        <button
          class="button modal__button modal__button--delete"
          @click="deleteTask()"
        >
          Delete
        </button>
      </div>
    </div>
    <div :class="isExpanded ? 'task__header--expanded' : 'task__header'">
      <h3
        class="task__title"
        :contenteditable="isEditable ? 'true' : 'false'"
        @input="handleTaskInput('task', $event)"
      >
        {{ taskData.task }}
      </h3>
      <div class="task__options">
        <button
          v-if="taskData.description"
          type="button"
          class="header-button"
          :class="isExpanded ? 'task__expand--expanded' : 'task__expand'"
          @click="isExpanded = !isExpanded"
        ></button>
        <button
          type="button"
          class="header-button"
          :class="isEditable ? 'task__edit--editable' : 'task__edit'"
          @click="toggleEditMode()"
        ></button>
        <button
          type="button"
          class="header-button task__delete"
          @click="modalVisible = true"
        ></button>
      </div>
    </div>
    <div
      :class="isExpanded ? 'task__description--expanded' : 'task__description'"
      :contenteditable="isEditable ? 'true' : 'false'"
      @input="handleTaskInput('description', $event)"
    >
      {{ taskData.description }}
    </div>
    <div class="task__footer">
      <div class="task__timestamp">
        Created on
        <span class="task__timestamp--highlighted">{{
          formattedCreationDate
        }}</span>
        at
        <span class="task__timestamp--highlighted">{{
          formattedCreationTime
        }}</span>
        <template v-if="hasBeenEditedPreviously">
          <span class="task__timestamp--delimiter">|</span>Edited on
          <span class="task__timestamp--highlighted">{{
            convertedEditDate
          }}</span>
          at
          <span class="task__timestamp--highlighted">{{
            convertedEditTime
          }}</span>
        </template>
      </div>
      <div class="task__frequency">
        <template v-if="!isEditable">
          {{
            convertFrequency(
              (taskData as Database["tasks"])
                .frequency_id as Database["frequency"]["frequency_id"]
            )
          }}
        </template>
        <template v-else>
          <FormHandler
            :formData="propData"
            v-model:dataAttributeValue="localTask['frequency']"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.header-button {
  all: unset;
  aspect-ratio: 1/1;
  min-width: 24px;
  mask-size: cover;
  -webkit-mask-size: cover;
  background-color: hsl(0, 0%, 70%);
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
  transition: background-color 175ms;
  &:hover {
    background-color: hsl(0, 0%, 80%);
  }
}
.task {
  position: relative;
  border: 1px solid hsl(0, 0%, 30%);
  border-radius: 0.5rem;
  background-color: hsl(0, 0%, 15%);
  &__header,
  &__header--expanded,
  &__description--expanded,
  &__footer {
    padding: 0.5rem;
  }
  &__header,
  &__header--expanded {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 0.5rem 0.5rem 0 0;
    background-color: hsl(0, 0%, 10%);
  }
  &__header {
    border-bottom: 1px solid hsla(0, 0%, 35%, 0);
    transition: border-bottom 125ms;
    &--expanded {
      border-bottom: 1px solid hsla(0, 0%, 35%, 1);
    }
  }
  &__title {
    width: 100%;
    font-size: 1.15rem;
  }
  &__options {
    display: flex;
    column-gap: 0.25rem;
    margin-left: 0.5rem;
  }
  &__expand {
    mask: url("/img/svg/expand-more.svg") no-repeat center center;
    -webkit-mask: url("/img/svg/expand-more.svg") no-repeat center center;
    &--expanded {
      mask: url("/img/svg/expand-less.svg") no-repeat center center;
      mask-size: cover;
      -webkit-mask: url("/img/svg/expand-less.svg") no-repeat center center;
      -webkit-mask-size: cover;
      background-color: hsl(0, 0%, 90%);
      &:hover {
        background-color: hsl(0, 0%, 90%);
      }
    }
  }
  &__edit {
    mask: url("/img/svg/edit.svg") no-repeat center center;
    -webkit-mask: url("/img/svg/edit.svg") no-repeat center center;
    &--editable {
      mask: url("/img/svg/save.svg") no-repeat center center;
      mask-size: cover;
      -webkit-mask: url("/img/svg/save.svg") no-repeat center center;
      -webkit-mask-size: cover;
      background-color: hsl(0, 0%, 90%);
      &:hover {
        background-color: hsl(0, 0%, 90%);
      }
    }
  }
  &__delete {
    mask: url("/img/svg/delete.svg") no-repeat center center;
    -webkit-mask: url("/img/svg/delete.svg") no-repeat center center;
  }
  &__description,
  &__description--expanded {
    display: grid;
    font-size: 0.9rem;
  }
  &__description {
    $transition-time: 175ms;
    grid-template-rows: 0px;
    opacity: 0;
    padding: 0 0.5rem;
    transition: opacity $transition-time, grid-template-rows $transition-time,
      padding $transition-time;
    &--expanded {
      opacity: 1;
      grid-template-rows: 1fr;
      transition: opacity $transition-time, grid-template-rows $transition-time,
        padding $transition-time;
    }
  }
  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid hsl(0, 0%, 35%);
    font-size: 0.9rem;
  }
  &__timestamp {
    &--highlighted {
      border-bottom: 1px dotted hsl(0, 0%, 75%);
    }
    &--delimiter {
      margin-inline: 0.5rem;
      color: hsl(0, 0%, 40%);
    }
  }
  &--edited {
    border: 1px solid hsl(10, 50%, 50%);
  }
}
.modal {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  display: grid;
  align-items: center;
  inset: 0;
  z-index: 10;
  padding: 0.5rem;
  transition: opacity 175ms, visibility 175ms, backdrop-filter 175ms;
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 0;
    border-radius: 0.5rem;
    background-color: hsla(0, 0%, 10%, 0.85);
    backdrop-filter: blur(0.25rem);
  }
  &--visible {
    visibility: visible;
    opacity: 1;
    z-index: 10;
  }
  &__message {
    position: relative;
    z-index: 10;
    margin: auto;
  }
  &__options {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    column-gap: 1rem;
    z-index: 10;
  }
  &__button {
    z-index: 10;
    border: 1px solid hsl(0, 0%, 30%);
    font-size: 0.9rem;
    transition: background-color 175ms;
    align-self: start;
    &--delete {
      background-color: hsl(10, 50%, 50%);
      &:hover {
        background-color: hsl(10, 75%, 50%);
      }
    }
  }
}
</style>

<script setup lang="ts">
/* Pinia stores */
const notificationsStore = useNotificationsStore();
const taskStore = useTaskStore();
const userStore = useUserStore();
/* Prop/v-model-related data */
const props = defineProps({
  taskData: { type: Object as PropType<Database["tasks"]>, required: true },
});
const propData: FormHandlerData = {
  index: 0,
  formID: "frequency",
  elementType: "autocomplete",
  labelText: "Frequency",
  options: [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "fortnightly", label: "Fortnightly" },
    { value: "monthly", label: "Monthly" },
    { value: "triannually", label: "Tri-annually (4 months)" },
    { value: "biannually", label: "Bi-annually (6 months)" },
    { value: "annually", label: "Annually" },
  ],
};
/* Reactive variables */
const isEditable: Ref<boolean> = ref(false);
const isExpanded: Ref<boolean> = ref(false);
const hasBeenEditedPreviously: Ref<boolean> = ref(false);
const hasBeenEditedLocally: Ref<boolean> = ref(false);
const modalVisible: Ref<boolean> = ref(false);
const localTask = reactive({
  task: "",
  description: "",
  frequency: "",
});
const formattedCreationDate: Ref<string> = ref("");
const formattedCreationTime: Ref<string> = ref("");
const convertedEditDate: Ref<string> = ref("");
const convertedEditTime: Ref<string> = ref("");
/**
 * Called on a task when edit mode is induced.
 * Updates localTask reactive variable to sync with changes made.
 * @param prop {"task"|"description"|"frequency"} - string that references the value to be altered
 * @param event {Event} - relevant input event, passed by $event in the template
 * @param {string}[value] - optional string populated via modelValue emit
 */
function handleTaskInput(
  prop: "task" | "description" | "frequency",
  event: Event,
  value?: string
): void {
  console.log(event);
  if (prop !== "frequency") {
    const target = event.target as HTMLHeadingElement | HTMLDivElement;
    localTask[prop] = target.textContent ?? "";
  } else {
    if (value) localTask.frequency = value;
  }
  detectChanges();
}
/**
 * Determines differences between prop data/local copy.
 * Updates hasBeenEditedLocally value to be utilised in other logic.
 */
function detectChanges(): void {
  if (
    localTask.task !== props.taskData.task ||
    localTask.description !== props.taskData.description ||
    localTask.frequency !==
      convertFrequency(
        props.taskData.frequency_id as Database["frequency"]["frequency_id"]
      )
  ) {
    hasBeenEditedLocally.value = true;
  } else {
    hasBeenEditedLocally.value = false;
  }
}
/**
 * Determines whether a task is in an editable state or not.
 * If hasBeenEditedLocally is true when it is called, call updateTask to commit the changes.
 */
function toggleEditMode(): void {
  if (!editIsValid()) return;
  isEditable.value = !isEditable.value;
  isEditable.value ? (isExpanded.value = true) : (isExpanded.value = false);
  if (hasBeenEditedLocally.value) {
    if (editIsValid()) {
      updateTask();
    }
  }
}
/**
 * Connects to database, updates data and pushes a notification to the user.
 * Commits only if a task has been edited, differences are present between the prop
 * and local copy and the user opts to commit the alteration.
 */
async function updateTask(): Promise<void> {
  const timestamp = new Date().toISOString();
  const { error } = await useSupabaseClient<Database>()
    .from("tasks")
    .update({
      task: localTask.task,
      description: localTask.description,
      frequency_id: convertFrequency(
        localTask.frequency as Database["frequency"]["repeats_every"]
      ),
      edited_at: timestamp,
    })
    .eq("task_id", props.taskData.task_id);
  if (error) {
    notificationsStore.setMessage(error.message, "error");
    return;
  }
  notificationsStore.setMessage(`Task updated successfully`, "success");
  hasBeenEditedLocally.value = false;
  props.taskData.task = localTask.task;
  props.taskData.description = localTask.description;
  props.taskData.frequency_id = convertFrequency(
    localTask.frequency as Database["frequency"]["repeats_every"]
  ) as number;
  updateEditDateAndTime(timestamp);
}
/**
 * Connects to database, deletes data and pushes a notification to the user.
 */
async function deleteTask(): Promise<void> {
  const { error } = await useSupabaseClient<Database>()
    .from("tasks")
    .delete()
    .eq("task_id", props.taskData.task_id);
  if (error) {
    notificationsStore.setMessage(error.message, "error");
    return;
  }
  notificationsStore.setMessage(`Task deleted successfully`, "success");
  modalVisible.value = false;
  taskStore.getTasks();
}
function checkForPreviousEdit(): void {
  for (const task of taskStore.tasks) {
    if (task.task_id === props.taskData.task_id) {
      if (task.edited_at) {
        hasBeenEditedPreviously.value = true;
        updateEditDateAndTime(task.edited_at);
        return;
      }
    }
  }
}
function updateEditDateAndTime(timestamp: string): void {
  const timeOptions = { timeStyle: "short" };
  convertedEditDate.value = convertDate(
    timestamp,
    userStore.getCountryISOCode() as string
  ) as string;
  convertedEditTime.value = convertTime(
    timestamp,
    userStore.getCountryISOCode() as string,
    timeOptions as Intl.LocaleOptions
  ) as string;
}
function editIsValid(): boolean | void {
  if (!hasBeenEditedLocally.value) return true;
  if (!localTask.task) {
    notificationsStore.setMessage("Please enter a valid task name", "error");
    return false;
  } else if (!localTask.frequency) {
    notificationsStore.setMessage(
      "Please enter a valid task frequency",
      "error"
    );
    return false;
  }
  return true;
}
/*
Create a reactive copy of the prop data for potential edits
Read the timestamp from the props and attempt to populate date/time refs
*/
onMounted(async () => {
  if (!userStore.data) await userStore.fetchData();
  localTask.task = props.taskData.task;
  localTask.description = props.taskData.description;
  localTask.frequency = convertFrequency(
    props.taskData.frequency_id as Database["frequency"]["frequency_id"]
  ) as string;
  formattedCreationDate.value = convertDate(
    props.taskData.created_at,
    userStore.getCountryISOCode() as string
  ) as string;
  formattedCreationTime.value = convertTime(
    props.taskData.created_at,
    userStore.getCountryISOCode() as string,
    {
      timeStyle: "short",
    }
  ) as string;
  checkForPreviousEdit();
});
</script>
