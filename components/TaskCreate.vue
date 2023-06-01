<template>
  <div class="create-task">
    <form>
      <template v-for="formData in propData" :key="formData.index">
        <FormHandler
          :formData="formData"
          v-model="newTask[formData.formID]"
          @input="validateInput()"
        />
      </template>
      <button
        type="button"
        class="button"
        @click="createNewTask(newTask)"
        :disabled="!isValidInput"
        :aria-disabled="!isValidInput"
      >
        Submit
      </button>
    </form>
  </div>
</template>

<style scoped lang="scss"></style>

<script setup lang="ts">
/* Prop/v-model-related data */
const propData: Array<CompFormObject> = [
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
    elementType: "select",
    labelText: "Frequency",
    options: [
      { value: "unset", text: "Please select an option", isDisabled: true },
      { value: "daily", text: "Daily" },
      { value: "weekly", text: "Weekly" },
      { value: "fortnightly", text: "Fortnightly" },
      { value: "monthly", text: "Monthly" },
      { value: "triannually", text: "Tri-annually (3 months)" },
      { value: "biannually", text: "Bi-annually (6 months)" },
      { value: "annually", text: "Annually" },
    ],
    default: "unset",
  },
];
/* Pinia stores */
const notificationsStore = useNotificationsStore();
const taskStore = useTaskStore();
/* Reactive variables */
const newTask: TaskDataObject = reactive({
  task: "",
  description: "",
  frequency: "unset",
});
const isValidInput: Ref<boolean> = ref(false);
/**
 * Checks to see if the task title and frequency fields are populated.
 * If both conditions are true, sets isValidInput to true and returns, and vice-versa.
 * Called in createNewTask() and used for validation in template with :disabled attribute on submit button.
 */
function validateInput(): void {
  if (newTask.task === "") {
    isValidInput.value = false;
    return;
  } else if (newTask.frequency === "unset") {
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
 * @param taskData {TaskDataObject} - object containing task data
 */
async function createNewTask(taskData: TaskDataObject): Promise<void> {
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
          taskData.frequency as Database["frequency"]["repeats_every"]
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
  newTask.task = "";
  newTask.description = "";
  newTask.frequency = "unset";
}
</script>
