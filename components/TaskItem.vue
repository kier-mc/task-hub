<template>
  <div class="task" :class="{ 'task--edited': hasBeenEdited }">
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
          @click="deleteTask"
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
        {{ data.task }}
      </h3>
      <div class="task__options">
        <button
          type="button"
          class="header-button"
          :class="isExpanded ? 'task__expand--expanded' : 'task__expand'"
          @click="isExpanded = !isExpanded"
        ></button>
        <button
          type="button"
          class="header-button"
          :class="isEditable ? 'task__edit--editable' : 'task__edit'"
          @click="toggleEditMode"
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
      {{ data.description }}
    </div>
    <div class="task__footer">
      <div class="task__timestamp">
        Created on
        <span class="task__timestamp--highlighted">{{ convertedDate }}</span> at
        <span class="task__timestamp--highlighted">{{ convertedTime }}</span>
      </div>
      <div class="task__frequency">
        <template v-if="!isEditable">
          {{
            convertFrequency(
              (data as Database["tasks"])
                .frequency_id as Database["frequency"]["frequency_id"]
            )
          }}
        </template>
        <template v-else>
          <FormHandler
            :formData="propData"
            v-model="localTask['frequency']"
            @update:modelValue="handleTaskInput('frequency', $event)"
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
    font-size: 1.15rem;
  }
  &__options {
    display: flex;
    column-gap: 0.25rem;
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
    border-top: 1px solid hsl(0, 0%, 35%);
    font-size: 0.9rem;
  }
  &__timestamp {
    &--highlighted {
      border-bottom: 1px dotted hsl(0, 0%, 75%);
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
/* Prop/v-model-related data */
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
    { value: "triannually", text: "Tri-annually (3 months)" },
    { value: "biannually", text: "Bi-annually (6 months)" },
    { value: "annually", text: "Annually" },
  ],
};
/* Reactive variables */
const isEditable: Ref<boolean> = ref(false);
const isExpanded: Ref<boolean> = ref(false);
const hasBeenEdited: Ref<boolean> = ref(false);
const modalVisible: Ref<boolean> = ref(false);
const localTask = reactive({
  task: "",
  description: "",
  frequency: "",
});
const convertedDate: Ref<string> = ref("");
const convertedTime: Ref<string> = ref("");
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
 * Updates hasBeenEdited value to be utilised in other logic.
 */
function detectChanges(): void {
  if (
    localTask.task !== props.data.task ||
    localTask.description !== props.data.description ||
    localTask.frequency !==
      convertFrequency(
        props.data.frequency_id as Database["frequency"]["frequency_id"]
      )
  ) {
    hasBeenEdited.value = true;
  } else {
    hasBeenEdited.value = false;
  }
}
/**
 * Determines whether a task is in an editable state or not.
 * If hasBeenEdited is true when it is called, call updateTask to commit the changes.
 */
function toggleEditMode(): void {
  isEditable.value = !isEditable.value;
  isEditable.value ? (isExpanded.value = true) : (isExpanded.value = false);
  if (hasBeenEdited.value) {
    updateTask();
  }
}
/**
 * Connects to database, updates data and pushes a notification to the user.
 * Commits only if a task has been edited, differences are present between the prop
 * and local copy and the user opts to commit the alteration.
 */
async function updateTask(): Promise<void> {
  const { error } = await useSupabaseClient<Database>()
    .from("tasks")
    .update({
      task: localTask.task,
      description: localTask.description,
      frequency_id: convertFrequency(
        localTask.frequency as Database["frequency"]["repeats_every"]
      ),
    })
    .eq("task_id", props.data.task_id);
  if (error) {
    notificationsStore.setMessage(error.message, "error");
    return;
  }
  notificationsStore.setMessage(`Task updated successfully`, "success");
  hasBeenEdited.value = false;
  props.data.task = localTask.task;
  props.data.description = localTask.description;
  props.data.frequency_id = convertFrequency(
    localTask.frequency as Database["frequency"]["repeats_every"]
  ) as number;
}
/**
 * Connects to database, deletes data and pushes a notification to the user.
 */
async function deleteTask(): Promise<void> {
  const { error } = await useSupabaseClient<Database>()
    .from("tasks")
    .delete()
    .eq("task_id", props.data.task_id);
  if (error) {
    notificationsStore.setMessage(error.message, "error");
    return;
  }
  notificationsStore.setMessage(`Task deleted successfully`, "success");
  modalVisible.value = false;
  taskStore.getTasks();
}
/*
Create a reactive copy of the prop data for potential edits
Read the timestamp from the props and attempt to populate date/time refs
*/
onMounted(() => {
  localTask.task = props.data.task;
  localTask.description = props.data.description;
  localTask.frequency = convertFrequency(
    props.data.frequency_id as Database["frequency"]["frequency_id"]
  ) as string;
  convertedDate.value = convertDate(props.data.created_at, "en-GB") as string;
  convertedTime.value = convertTime(props.data.created_at, "en-GB", {
    timeStyle: "short",
  }) as string;
});
</script>
