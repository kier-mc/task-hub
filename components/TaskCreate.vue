<template>
  <div class="container__create-task">
    <article class="create-task">
      <FormInput
        class="create-task__input"
        :data="propData.data.input.label"
        v-model:emit-value="task.task"
      />
      <FormInput
        class="create-task__input"
        :data="propData.data.input.description"
        v-model:emit-value="task.description"
      />
      <FormAutocomplete
        class="create-task__input"
        :data="propData.data.autocomplete.frequency"
        v-model:emit-term="receiver.term"
        v-model:emit-data="receiver.data"
      />
      <AppButton
        class="create-task__button create-task__button--tags"
        :data="propData.data.button.tags"
      />
      <FormTags
        class="create-task__tags"
        :data="propData.data.tags"
        :is-expanded="tagsAreExpanded"
        v-model:selected-tags="tags"
      />
      <AppButton
        v-if="editMode"
        class="create-task__button create-task__button--submit"
        :data="propData.data.button.update"
        :is-disabled="!taskIsValid || requestInProgress"
        :is-loading="requestInProgress"
      />
      <AppButton
        v-else
        class="create-task__button create-task__button--submit"
        :data="propData.data.button.create"
        :is-disabled="!taskIsValid || requestInProgress"
        :is-loading="requestInProgress"
      />
    </article>
  </div>
</template>

<style scoped lang="scss">
@use "../assets/scss/data/colour";
@use "../assets/scss/data/effect";
@use "../assets/scss/data/layout";
.container__create-task {
  max-width: 40ch;
  box-shadow: effect.$drop-shadow-md;
  @media (max-width: layout.$breakpoint-md) {
    max-width: calc(100% - 2rem);
  }
}
.header {
  display: flex;
  align-items: center;
  height: 3rem;
  padding-inline: 1rem;
  background-image: colour.$window-title;
  color: colour.$font-light;
  &__title {
    all: unset;
    font-size: 1.025rem;
    font-weight: bold;
  }
}
.create-task {
  position: relative;
  padding: 1rem;
  margin-inline: auto;
  background-color: colour.$window-body;
  &__input {
    margin-bottom: 1rem;
  }
  &__show-tags {
    all: unset;
    cursor: pointer;
  }
  &__button {
    &--submit {
      width: calc(100% - 1rem);
      margin-left: auto;
    }
  }
}
</style>

<script setup lang="ts">
// Types
import type {
  FormInputPropData,
  FormAutocompletePropData,
  AutocompleteEmitFrequencyData,
} from "~/types/components/forms";
import type { ButtonPropData } from "~/types/components/app";
import type { NewTaskData, TaskData } from "~/types/components/tasks";
import type { TagData } from "~/types/schema";

// Components
import { SVGPlus, SVGEdit } from "#components";

// Pinia stores
const taskStore = useTaskStore();

// Prop definitions
const props = defineProps({
  editMode: { type: Boolean as PropType<boolean>, required: false },
  editData: { type: Object as PropType<TaskData>, required: false },
});

// Prop data
const propData = {
  data: {
    input: <Record<string, FormInputPropData>>{
      label: {
        index: 0,
        type: "input",
        label: "Task",
        attributes: {
          id: "label",
          type: "text",
        },
      },
      description: {
        index: 1,
        type: "input",
        label: "Description",
        attributes: {
          id: "description",
          type: "text",
        },
      },
    },
    autocomplete: <Record<string, FormAutocompletePropData>>{
      frequency: {
        index: 2,
        type: "autocomplete",
        label: "Frequency",
        attributes: {
          id: "frequency",
        },
        options: $tasks.frequency.generateAutocompleteData(),
      },
    },
    tags: $tasks.tags.getPropData(),
    button: <Record<string, ButtonPropData>>{
      tags: {
        function: () => (tagsAreExpanded.value = !tagsAreExpanded.value),
        label: "Tags",
        attributes: {
          type: "button",
        },
      },
      create: {
        function: async () => await createTaskWrapper(task.value),
        label: "Create",
        icon: SVGPlus,
        attributes: {
          type: "button",
        },
      },
      update: {
        function: async () => await updateTaskWrapper(task.value),
        label: "Update",
        icon: SVGPlus,
        attributes: {
          type: "button",
        },
      },
    },
  },
};

// Reactive variables
const receiver: Ref<AutocompleteEmitFrequencyData> = ref({
  term: null,
  data: {
    frequency_id: null,
    repeats_every: null,
  },
});

const tags: Ref<TagData[]> = ref([]);

const task: Ref<NewTaskData> = ref({
  task: null,
  description: null,
  frequency: null,
  tags: [],
});

const tagsAreExpanded: Ref<boolean> = ref(false);
const requestInProgress: Ref<boolean> = ref(false);

// Computed properties
const taskIsValid = computed(() => {
  if (!task.value.task || !task.value.frequency) {
    return false;
  }
  return true;
});

// Watchers
watch(receiver.value, () => {
  task.value.frequency = receiver.value.data;
});

watch(tags.value, () => {
  task.value.tags = tags.value;
});

// Functions
async function createTaskWrapper(taskData: NewTaskData) {
  requestInProgress.value = true;
  await taskStore.createTask(taskData);
  await taskStore.fetchData();
  clearData();
  requestInProgress.value = false;
}

async function updateTaskWrapper(taskData: NewTaskData) {
  if (!props.editData) {
    throw new Error("Cannot update task. No edit data supplied");
  }
  console.log(taskData);
  requestInProgress.value = true;
  await taskStore.updateTask(taskData, props.editData.task_id);
  await taskStore.fetchData(true);
  requestInProgress.value = false;
}

function clearData() {
  task.value.task = null;
  task.value.description = null;
  tags.value = [];
  receiver.value.term = null;
  receiver.value.data = null;
}

function synchroniseInput() {
  if (!props.editData) return;
  task.value.task = props.editData.task;
  task.value.description = props.editData.description;
}

function synchroniseReceiver() {
  if (!props.editData) return;
  if (!props.editData.frequency.frequency_id) return;
  if (!receiver.value.data) return;
  const options = propData.data.autocomplete.frequency.options;
  const index = props.editData.frequency.frequency_id - 1;
  const term = options[index].term;
  receiver.value.term = term;
  receiver.value.data.frequency_id = props.editData.frequency.frequency_id;
  receiver.value.data.repeats_every = props.editData.frequency.repeats_every;
}

function synchroniseTags() {
  if (!props.editData || !props.editData.tags) return;
  tags.value = props.editData.tags;
  task.value.tags = tags.value;
}

onMounted(() => {
  if (props.editMode && !props.editData) {
    console.warn(
      "Edit mode enabled but no data supplied. Form fields will be blank"
    );
  }
  if (props.editMode) {
    synchroniseInput();
    synchroniseReceiver();
    synchroniseTags();
  }
});
</script>
