<template>
  <section class="tasks">
    <div class="tasks__options">
      <AppButton :data="propData.data.button.create" class="tasks__option" />
      <AppButton :data="propData.data.button.filter" class="tasks__option" />
    </div>
    <div class="tasks__filtered-by">
      <template v-if="filterOptions.length">
        Filtering tasks by
        <span class="filter-label">{{ displayActiveFilters }}</span>
      </template>
      <template v-else>No filters applied</template>
    </div>
    <TaskList class="tasks__list" :data="tasks" />
  </section>
  <AppModal :title="setModalTitle" v-model:show-modal="modalVisible">
    <template v-if="activeComponent === 'create'">
      <TaskCreate />
    </template>
    <template v-else-if="activeComponent === 'filter'">
      <TaskFilter v-model:emit-tags="filterOptions" />
    </template>
  </AppModal>
</template>

<style scoped lang="scss">
@use "../assets/scss/data/colour";
@use "../assets/scss/data/layout";
.tasks {
  width: calc(100% - 2rem);
  padding: 1rem;
  &__options {
    display: flex;
  }
  &__option {
    &:not(:last-child) {
      margin-right: 0.5rem;
    }
  }
  &__filtered-by {
    padding-block: 1rem;
    color: colour.$font-light;
  }
}
.filter-label {
  font-weight: bold;
  text-transform: capitalize;
}
</style>

<script setup lang="ts">
import type { TaskData } from "~/types/components/tasks";
import type { TagData } from "~/types/schema";
import type { ButtonPropData } from "~/types/components/app";

const taskStore = useTaskStore();

taskStore.$subscribe(() => {
  updateTaskList();
});

const propData = {
  data: {
    button: <Record<string, ButtonPropData>>{
      create: {
        function: async () => await createNewTask(),
        label: "Create New Task",
        attributes: {
          type: "button",
        },
      },
      filter: {
        function: async () => await filterTasks(),
        label: "Filter Tasks",
        attributes: {
          type: "button",
        },
      },
    },
  },
};

const tasks: Ref<TaskData[]> = ref([]);
const filterOptions: Ref<TagData[]> = ref([]);

const modalVisible: Ref<boolean> = ref(false);
const activeComponent: Ref<string | null> = ref(null);

const displayActiveFilters = computed(() => {
  const filterLabels = filterOptions.value.map((tag) => tag.label);
  return filterLabels.join(", ");
});

watch(filterOptions, () => updateTaskList(), { immediate: true });

function updateTaskList(): void {
  const taskData = taskStore.getTasks;
  if (!taskData) return;
  if (filterOptions.value.length === 0) {
    tasks.value = [...taskData];
    return;
  }
  tasks.value = taskData.filter((item) => {
    return filterOptions.value.every((data) => {
      if (!item.tags) return;
      return item.tags.some((tag) => tag.tag_id === data.tag_id);
    });
  });
}

const setModalTitle = computed(() => {
  switch (activeComponent.value) {
    case "create":
      return "Create New Task";
    case "filter":
      return "Filter Tasks";
  }
});

async function createNewTask() {
  activeComponent.value = "create";
  await nextTick();
  modalVisible.value = true;
}

async function filterTasks() {
  activeComponent.value = "filter";
  await nextTick();
  modalVisible.value = true;
}

onMounted(async () => {
  await taskStore.init();
  updateTaskList();
});
</script>
