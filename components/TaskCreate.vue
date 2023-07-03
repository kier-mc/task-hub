<template>
  <div class="create-task">
    <form>
      <FormHandler
        :form-data="propData.formHandler[0]"
        :emit-value="newTask.task"
        @update:emit-value="
          (value) => {
            (newTask.task = value), validateInput;
          }
        "
      />

      <FormHandler
        :form-data="propData.formHandler[1]"
        :emit-value="newTask.description"
        @update:emit-value="
          (value) => {
            (newTask.description = value), validateInput;
          }
        "
      />

      <FormAutocomplete
        :form-data="propData.formHandler[2]"
        :emit-label="newTask.frequency.label"
        :emit-value="newTask.frequency.value"
        @update:emit-label="
          (label) => {
            (newTask.frequency.label = label), validateInput;
          }
        "
        @update:emit-value="
          (value) => {
            (newTask.frequency.value = value as FrequencyRepetition), validateInput;
          }
        "
      />

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
/* Prop data */
const propData = {
  formHandler: [
    {
      index: 0,
      formID: "task",
      elementType: "input",
      attrType: "text",
      labelText: "Task",
    } as FormHandlerData,
    {
      index: 1,
      formID: "description",
      elementType: "input",
      attrType: "text",
      labelText: "Description",
    } as FormHandlerData,
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
        { value: "triannually", label: "Tri-annually (4 months)" },
        { value: "biannually", label: "Bi-annually (6 months)" },
        { value: "annually", label: "Annually" },
      ],
    } as FormHandlerData,
  ],
};
/* Pinia stores */
const notificationsStore = useNotificationsStore();
const taskStore = useTaskStore();

/* Reactive variables */
const taskData: PartialTaskData = reactive({
  task: null,
  description: null,
});
const frequencyData: AutocompleteTaskFrequencyData = reactive({
  label: null,
  value: null,
});
const newTask: ComputedRef<CompleteTaskData> = computed(() => {
  return {
    task: taskData.task,
    description: taskData.description,
    frequency: { ...frequencyData },
  };
});
const isValidInput: Ref<boolean> = ref(false);

/* Computed properties */
const validateInput = computed(() => {
  if (taskData.task && frequencyData.value) {
    return (isValidInput.value = true);
  }
  return (isValidInput.value = false);
});

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
      "You must enter a task name and frequency to create a task",
      "error"
    );
    return;
  }
  const user = await useSupabaseAuthClient().auth.getUser();
  if (!user.data.user) throw new Error("No active user found");
  if (!taskData.frequency.value) return;
  const frequencyID = convertFrequency(taskData.frequency.value);
  const { error } = await useSupabaseClient<Database>()
    .from("tasks")
    .insert([
      {
        author_id: user.data.user.id,
        task: taskData.task,
        description: taskData.description,
        frequency_id: frequencyID,
      },
    ]);
  if (error) {
    notificationsStore.setMessage(error.message, "error");
    return;
  }
  notificationsStore.setMessage("Successfully created task", "success");
  clearCredentials([ref(taskData), ref(frequencyData)]);
  taskStore.getTasks();
}
</script>
