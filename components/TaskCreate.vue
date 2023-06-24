<template>
  <div class="create-task">
    <form>
      <template v-for="formData in propData" :key="formData.index">
        <template v-if="formData.elementType === 'input'">
          <FormHandler
            :formData="formData"
            v-model:input-element-value="rawTaskData[formData.formID]"
            @input="validateInput()"
          />
        </template>
        <template v-else-if="formData.elementType === 'autocomplete'">
          <FormHandler
            :formData="formData"
            v-model:input-element-value="rawTaskFrequencyData.label"
            v-model:data-attribute-value="rawTaskFrequencyData.value"
            @input="validateInput()"
          />
        </template>
      </template>
      <button
        type="button"
        class="button"
        :disabled="!isValidInput"
        :aria-disabled="!isValidInput"
        @click="createNewTask(newTask)"
      >
        Submit
      </button>
    </form>
  </div>
</template>

<style scoped lang="scss"></style>

<script setup lang="ts">
/* Prop/v-model-related data */
const propData: Array<FormHandlerData> = [
  {
    index: 0,
    formID: "task",
    elementType: "input",
    attrType: "text",
    labelText: "Task",
  },
  {
    index: 1,
    formID: "description",
    elementType: "input",
    attrType: "text",
    labelText: "Description",
  },
  {
    index: 2,
    formID: "frequency",
    elementType: "autocomplete",
    labelText: "Frequency",
    options: [
      { value: "daily", label: "Daily" },
      { value: "weekly", label: "Weekly" },
      { value: "fortnightly", label: "Fortnightly" },
      { value: "monthly", label: "Monthly" },
      { value: "triannually", label: "Tri-annually (3 months)" },
      { value: "biannually", label: "Bi-annually (6 months)" },
      { value: "annually", label: "Annually" },
    ],
  },
];
/* Pinia stores */
const notificationsStore = useNotificationsStore();
const taskStore = useTaskStore();
/* Reactive variables */
const rawTaskData: RawTaskData = reactive({
  task: undefined,
  description: undefined,
});
const rawTaskFrequencyData: AutocompleteTaskFrequencyData = reactive({
  label: undefined,
  value: undefined,
});
const newTask: ComputedRef<CompleteTaskData> = computed(() => {
  return {
    ...rawTaskData,
    frequency: { ...rawTaskFrequencyData },
  } as CompleteTaskData;
});
const isValidInput: Ref<boolean> = ref(false);
/**
 * Checks to see if the task title and frequency fields are populated.
 * If both conditions are true, sets isValidInput to true and returns, and vice-versa.
 * Called in createNewTask() and used for validation in template with :disabled attribute on submit button.
 */
function validateInput(): void {
  if (
    newTask.value.task === undefined &&
    newTask.value.frequency.value === undefined
  ) {
    isValidInput.value = false;
    return;
  }
  isValidInput.value = true;
  return;
}
/**
 * Attempts to create a new task from the supplied data.
 * Pushes a notification and returns early if no valid task is entered prior to submission.
 * Throws an error if no valid user is detected.
 * @param taskData {ComputedRef<CompleteTaskData>}
 * A reactive data object containing user-supplied data to submit to the back end.
 */
async function createNewTask(taskData: CompleteTaskData): Promise<void> {
  if (!isValidInput) {
    notificationsStore.setMessage(
      "You must enter a task name before submitting",
      "error"
    );
    return;
  }
  const user = await useSupabaseAuthClient().auth.getUser();
  if (!user.data.user) throw new Error("No active user found");
  const { error } = await useSupabaseClient<Database>()
    .from("tasks")
    .insert([
      {
        author_id: user.data.user.id,
        task: taskData.task,
        description: taskData.description,
        frequency_id: convertFrequency(
          taskData.frequency.value as Database["frequency"]["repeats_every"]
        ),
      },
    ]);
  if (error) {
    notificationsStore.setMessage(error.message, "error");
    return;
  }
  notificationsStore.setMessage("Successfully created task", "success");
  clearAllFields();
  taskStore.getTasks();
}
/**
 * Helper function to reset forms and data bindings.
 * Called when a task has been successfully submitted.
 */
function clearAllFields(): void {
  newTask.value.task = undefined;
  newTask.value.description = undefined;
  newTask.value.frequency.label = undefined;
  newTask.value.frequency.value = undefined;
}
</script>
