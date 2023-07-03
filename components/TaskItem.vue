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
    <div
      :class="
        isExpanded ? 'task__header task__header--expanded' : 'task__header'
      "
    >
      <h3 v-show="!isEditable" class="task__title">
        {{ localTask.task }}
      </h3>
      <label v-show="isEditable" class="screen-reader-label" for="task-title"
        >Task Title</label
      >
      <input
        v-show="isEditable"
        id="task-title"
        class="task__title--editable"
        :value="localTask.task"
        @input="
          {
            handleTaskInput('task', $event);
          }
        "
      />

      <div class="task__options">
        <button
          v-show="localTask.description"
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
      v-show="!isEditable"
      :class="isExpanded ? 'task__description--expanded' : 'task__description'"
    >
      {{ localTask.description }}
    </div>
    <div
      v-show="isEditable"
      :class="isExpanded ? 'task__description--expanded' : 'task__description'"
    >
      <input
        class="task__description--editable"
        :value="localTask.description"
        @input="
          {
            handleTaskInput('description', $event);
          }
        "
      />
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
        <template v-show="hasBeenEditedPreviously">
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
          {{ localTask.frequency.label }}
        </template>

        <FormAutocomplete
          v-if="isEditable"
          :form-data="propData.formHandler[0]"
          :emit-label="(localTask.frequency.label as string)"
          :emit-value="(localTask.frequency.value as Database['frequency']['repeats_every'])"
          @update:emit-label="
            (label) => {
              (localTask.frequency.label = label), detectChanges;
            }
          "
          @update:emit-value="
            (value) => {
              (localTask.frequency.value = value as FrequencyRepetition), detectChanges;
            }
          "
        />
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
    background-color: hsl(0, 0%, 10%);
  }
  &__header {
    position: relative;
    // Simulate a border without the layout shift
    &--expanded::before {
      content: "";
      position: absolute;
      right: 0;
      bottom: -1px;
      left: 0;
      height: 1px;
      background-color: hsl(0, 0%, 35%);
    }
  }
  &__title {
    width: 100%;
    font-size: 1.15rem;
    &--editable {
      all: unset;
      width: 100%;
      outline: 1px dashed hsla(0, 0%, 35%, 0.75);
      font-size: 1.15rem;
      font-weight: bold;
    }
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
    &--editable {
      all: unset;
      width: 100%;
      outline: 1px dashed hsl(0, 0%, 35%);
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
.screen-reader-label {
  position: absolute;
  left: -5000px;
  overflow: hidden;
  width: 1px;
  height: 1px;
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
const propData = {
  formHandler: [
    {
      index: 0,
      formID: "task-frequency",
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
    } as FormHandlerData,
  ],
};
/* Reactive variables */
const isEditable: Ref<boolean> = ref(false);
const isExpanded: Ref<boolean> = ref(false);
const hasBeenEditedPreviously: Ref<boolean> = ref(false);
const hasBeenEditedLocally: Ref<boolean> = ref(false);
const modalVisible: Ref<boolean> = ref(false);
const localTask: CompleteTaskData = reactive({
  task: null,
  description: null,
  frequency: {
    label: null,
    value: null,
  },
});
const formattedCreationDate: Ref<string> = ref("");
const formattedCreationTime: Ref<string> = ref("");
const convertedEditDate: Ref<string> = ref("");
const convertedEditTime: Ref<string> = ref("");
const frequencyLabels: Ref<Array<string | undefined>> = ref([]);
/**
 * Called on a task when edit mode is induced.
 * Updates localTask reactive variable to sync with changes made.
 * @param prop {"task"|"description"} - string that references the value to be altered
 * @param event {Event} - relevant input event, passed by $event in the template
 */
function handleTaskInput(prop: "task" | "description", event: Event): void {
  const target = event.target as HTMLInputElement;
  localTask[prop] = target.value ?? "";
}

const detectChanges = computed((): void => {
  const frequency = convertFrequency(
    props.taskData.frequency_id as Database["frequency"]["frequency_id"]
  );
  if (
    localTask.task !== props.taskData.task ||
    localTask.description !== props.taskData.description ||
    localTask.frequency.value !== frequency
  ) {
    hasBeenEditedLocally.value = true;
  } else {
    hasBeenEditedLocally.value = false;
  }
});

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
        localTask.frequency.value as Database["frequency"]["repeats_every"]
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
function generateFrequencyLabels(): void {
  if (!propData.formHandler[0].options) return;
  for (let i = 0; i < propData.formHandler[0].options.length; i++) {
    const option = propData.formHandler[0].options[i];
    frequencyLabels.value.push(option.label);
  }
}

/*
Create a reactive copy of the prop data for potential edits
Read the timestamp from the props and attempt to populate date/time refs
*/
onMounted(async () => {
  if (!userStore.data) await userStore.fetchData();
  generateFrequencyLabels();
  localTask.task = props.taskData.task;
  localTask.description = props.taskData.description;

  localTask.frequency.value = convertFrequency(
    props.taskData.frequency_id as Database["frequency"]["frequency_id"]
  ) as Database["frequency"]["repeats_every"];

  localTask.frequency.label = frequencyLabels.value[
    props.taskData.frequency_id - 1
  ] as string;

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
