<template>
  <div class="temp">
    <div class="create-todo">
      <h2>Create To-Do</h2>
      <form>
        <template v-for="formData in propData" :key="formData.index">
          <CompFormHandler
            :formData="formData"
            v-model="todo[formData.formID]"
          />
        </template>
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
      { value: "fornightly", text: "Fortnightly" },
      { value: "monthly", text: "Monthly" },
      { value: "tri-annually", text: "Tri-annually (3 months)" },
      { value: "semi-annually", text: "Semi-annually (6 months)" },
      { value: "annually", text: "Annually" },
    ],
  },
];
const todo: TodoDataObject = reactive({
  task: "",
  description: "",
  frequency: "",
});
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
onMounted(() => {
  emitDefaultFrequency();
});
</script>
