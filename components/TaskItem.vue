<template>
  <ClientOnly>
    <article class="task">
      <section v-if="deleteMode" class="delete-modal">
        <AppButton class="modal__button" :data="propData.button.cancel" />
        <AppButton class="modal__button" :data="propData.button.delete" />
      </section>
      <header class="task__header">
        <h3 class="task__title">{{ props.data.task }}</h3>
        <button
          v-if="props.data.description || props.data.tags"
          class="task__button"
          :title="isExpanded ? 'Hide content' : 'Show content'"
          type="button"
          @click="isExpanded = !isExpanded"
        >
          <SVGExpandMore :class="setExpandIconRotation" />
        </button>
      </header>
      <div
        v-if="props.data.description || props.data.tags"
        ref="expandable"
        class="task__expandable"
        :aria-expanded="isExpanded"
      >
        <section v-if="props.data.description" class="task__description">
          {{ props.data.description }}
        </section>
        <section v-if="props.data.tags" class="task__tags">
          <FormTag
            v-for="(tag, index) in props.data.tags"
            :key="index"
            :data="tag"
            class="task__tag"
          />
        </section>
      </div>
      <footer class="task__footer">
        <div class="task__timestamp">
          <span class="task__frequency-label">
            {{ props.data.frequency.repeats_every }}
          </span>
          <span class="task__timestamp--created-at"
            >Created
            {{ formatTimeAgo(new Date(props.data.timestamp.created_at)) }}
          </span>
          <span
            v-if="props.data.timestamp.edited_at"
            class="task__timestamp--edited-at"
            >Edited
            {{ formatTimeAgo(new Date(props.data.timestamp.edited_at)) }}</span
          >
        </div>
        <div class="task__options">
          <button
            class="task__option task__button task__button--footer"
            title="Edit"
            type="button"
            @click="editMode = true"
          >
            <SVGEdit class="task__icon task__icon--footer" />
          </button>
          <button
            class="task__option task__button task__button--footer"
            title="Delete"
            type="button"
            @click="deleteMode = true"
          >
            <SVGDelete class="task__icon task__icon--footer" />
          </button>
        </div>
      </footer>
    </article>
    <AppModal title="Edit Task" v-model:show-modal="editMode">
      <TaskCreate v-if="editMode" :edit-mode="true" :edit-data="props.data" />
    </AppModal>
  </ClientOnly>
</template>

<style scoped lang="scss">
@use "../assets/scss/data/colour";
@use "../assets/scss/data/easing";
@use "../assets/scss/data/effect";
@use "../assets/scss/data/fontsize";
.task {
  position: relative;
  background-color: colour.$neutral-800;
  box-shadow: effect.$drop-shadow-sm;
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 3rem;
    background-image: linear-gradient(
      100deg,
      colour.$gunmetal-400 0%,
      colour.$gunmetal-500 100%
    );
    color: colour.$font-light;
  }
  &__title {
    all: unset;
    padding-inline: 1rem;
    font-size: fontsize.$rg;
  }
  &__button {
    all: unset;
    display: flex;
    justify-content: center;
    align-items: center;
    aspect-ratio: 1/1;
    width: 3rem;
    cursor: pointer;
    &:hover .task__icon {
      fill: colour.$cerise-500;
    }
    &--footer {
      width: 1.5rem;
    }
  }
  /* prettier-ignore */
  &__icon {
    pointer-events: none;
    width: 1.5rem;
    fill: colour.$icon-light;
    transition:
      fill 500ms easing.$ease-out-quart,
      transform 350ms easing.$ease-out-quart;
    &--expanded {
      transform: rotateZ(180deg);
    }
    &--footer {
      fill: colour.$icon-dark;
    }
  }
  &__expandable {
    overflow: hidden;
    transition: height 500ms easing.$ease-out-quart;
    &--height-zero {
      height: 0px;
    }
    &[aria-expanded="true"] {
      height: v-bind(setExpandedHeight);
    }
  }
  &__description {
    padding-inline: 1rem;
    padding-block: 1rem;
    font-size: fontsize.$sm;
  }
  &__tags {
    display: flex;
    align-items: center;
    padding-inline: 1rem;
    padding-bottom: 1rem;
    &:only-of-type {
      padding-top: 1rem;
    }
  }
  &__tag {
    max-width: max-content;
    padding-inline: 0.5rem;
    &:not(:last-child) {
      margin-right: 0.5rem;
    }
  }
  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 2rem;
    background-color: colour.$neutral-600;
  }
  &__frequency-label {
    padding-right: 0.5rem;
    border-right: 1px solid colour.$gunmetal-800;
    margin-right: 0.5rem;
    text-transform: capitalize;
  }
  &__timestamp {
    padding-inline: 1rem;
    font-size: fontsize.$xxs;
    &--edited-at {
      padding-left: 0.5rem;
      border-left: 1px solid colour.$gunmetal-800;
      margin-left: 0.5rem;
    }
  }
  &__options {
    display: flex;
    align-items: center;
  }
  &__option {
    &:not(:last-child) {
      margin-right: 0.25rem;
    }
  }
  &:not(:last-child) {
    margin-bottom: 1rem;
  }
}
.delete-modal {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: colour.$modal-backdrop;
  color: colour.$font-light;
  &__button {
    &:not(:last-child) {
      margin-right: 0.5rem;
    }
  }
}
</style>

<script setup lang="ts">
// External imports
import { formatTimeAgo } from "@vueuse/core";

// Types
import type { TaskData } from "~/types/components/tasks";
import type { ButtonPropData } from "~/types/components/app";

// Pinia stores
const taskStore = useTaskStore();

// Prop definitions
const props = defineProps({
  data: {
    type: Object as PropType<TaskData>,
    required: true,
  },
});

// Prop data
const propData = {
  button: <Record<string, ButtonPropData>>{
    cancel: {
      function: () => (deleteMode.value = false),
      label: "Cancel",
      attributes: {
        type: "button",
      },
    },
    delete: {
      function: async () => deleteTaskWrapper(),
      label: "Delete",
      attributes: {
        type: "button",
      },
    },
  },
};

// Reactive variables
const isExpanded: Ref<boolean> = ref(false);
const expandableHeight: Ref<number> = ref(0);
const deleteMode: Ref<boolean> = ref(false);
const editMode: Ref<boolean> = ref(false);

// Template refs
const expandable: Ref<HTMLElement | null> = ref(null);

// Computed properties
const setExpandIconRotation = computed(() => {
  return isExpanded.value
    ? "task__icon task__icon--expanded"
    : "task__icon task__icon--expand";
});

const setExpandedHeight = computed(() => {
  if (!expandable.value) return;
  const height = expandableHeight.value;
  return `${height}px`;
});

// Watchers
watch(
  () => props.data,
  () => {
    calculateExpandedHeight();
  }
);

// Functions
/**
 * Wrapper for the task store deleteTask() function.
 * Ensures the correct ID is passed to the function and handles the task
 * modal visibility for the component.
 */
async function deleteTaskWrapper(): Promise<void> {
  const id = props.data.task_id;
  await taskStore.deleteTask(id);
  deleteMode.value = false;
}
/**
 * Calculates the height the task should be when fully expanded, including
 * any description, tags or other data that may or may not be present.
 * Used to provide an accurate number to the CSS so the height can be
 * animated smoothly without compromise.
 */
function calculateExpandedHeight(): void {
  if (!expandable.value) return;
  // Remove zero height class (if it exists) so height can be correctly recalculated for updates
  expandable.value.classList.remove("task__expandable--height-zero");
  expandableHeight.value = expandable.value.clientHeight;
  expandable.value.classList.add("task__expandable--height-zero");
}

// Hooks
onMounted(async () => {
  await nextTick();
  calculateExpandedHeight();
});
</script>
