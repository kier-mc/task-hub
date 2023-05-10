<template>
  <div class="temp">
    <div class="create-todo">
      <h2>Create To-Do</h2>
      <form>
        <template v-for="formData in propData" :key="formData.index">
          <CompFormHandler
            :formData="formData"
            v-model="todo[formData.formID]"
            @input="validateInput"
          />
        </template>
        <button
          type="button"
          class="button"
          @click="createNewTodo(todo)"
          :disabled="!isValidInput"
        >
          Submit
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.temp {
  padding: 1rem;
  background-color: hsl(0, 0%, 17.5%);
}
.create-todo {
  & h2 {
    padding-bottom: 1rem;
  }
}
</style>

<script setup lang="ts">
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
      { value: "daily", text: "Daily" },
      { value: "weekly", text: "Weekly" },
      { value: "fortnightly", text: "Fortnightly" },
      { value: "monthly", text: "Monthly" },
      { value: "tri-annually", text: "Tri-annually (3 months)" },
      { value: "semi-annually", text: "Semi-annually (6 months)" },
      { value: "annually", text: "Annually" },
    ],
  },
];
const user = useSupabaseUser();
const notifications = useNotificationsStore();
const todo: TodoDataObject = reactive({
  task: "",
  description: "",
  frequency: "",
});
const isValidInput: Ref<boolean> = ref(false);
/*
 * function emitDefaultFrequency()
 * Short function to set the default frequency as the value for todo on mounted
 * Returns if the frequency isn't empty
 * Called in onMounted() hook
 */
function emitDefaultFrequency(): void {
  if (todo.frequency !== "") return;
  todo.frequency = "daily";
}
/*
 * function getAuthor()
 * Queries the database to get the user_id from the current user's email
 * Derives this from the JWT value
 * @return: the user_id as a number, or -1 if nothing can be found
 */
async function getAuthor(): Promise<number> {
  if (!user.value) throw new Error("No active user found");
  const { data, error } = await useSupabaseClient<Database>()
    .from("users")
    .select("*")
    .eq("email", user.value.email);
  if (error) {
    notifications.setMessage(error.message, "error");
    return -1;
  }
  if (data) {
    return data[0].user_id;
  }
  return -1;
}
/*
 * function getFrequency()
 * Queries the database to get the frequency_id from the select value
 * @return: the frequency_id as a number, or -1 if nothing can be found
 */
async function getFrequency(): Promise<number> {
  const { data, error } = await useSupabaseClient<Database>()
    .from("frequency")
    .select("*")
    .eq("repeat_every", todo.frequency);
  if (error) {
    notifications.setMessage(error.message, "error");
    return -1;
  }
  if (data) {
    return data[0].frequency_id;
  }
  return -1;
}
/*
 * function validateInput()
 * Checks to see if the todo.task field is populated
 * If true, sets isValidInput ref to true and returns, and vice-versa
 * Called in createNewTodo() and used in template with :disabled attribute on button
 */
function validateInput(): void {
  if (todo.task === "") {
    isValidInput.value = false;
    return;
  }
  isValidInput.value = true;
  return;
}
/*
 * function createNewTodo()
 * Attempts to create a new to-do from the supplied data
 * Calls getAuthor() and getFrequency() to convert entered values to internal IDs
 * Early return if no valid task entered prior to submission
 */
async function createNewTodo(todo: TodoDataObject): Promise<void> {
  if (!isValidInput) {
    notifications.setMessage(
      "You must enter a task name before submitting",
      "error"
    );
    return;
  }
  const author = await getAuthor();
  const frequency = await getFrequency();
  const { data, error } = await useSupabaseClient<Database>()
    .from("tasks")
    .insert([
      {
        author_id: author,
        task: todo.task,
        description: todo.description,
        frequency_id: frequency,
      },
    ]);
  if (error) {
    notifications.setMessage(error.message, "error");
    return;
  }
  if (data) {
    notifications.setMessage("Successfully created task", "success");
    return;
  }
}
onMounted(() => {
  emitDefaultFrequency();
});
</script>
