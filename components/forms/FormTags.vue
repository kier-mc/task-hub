<template ClientOnly>
  <div ref="tagsElement" class="tags" :aria-expanded="props.isExpanded">
    <FormTag
      v-for="data in props.data"
      class="tag"
      :key="data.index"
      :data="data"
      :is-selected="isSelected[data.index]"
      @click="handleClick(data, $event)"
    />
  </div>
</template>

<style scoped lang="scss">
@use "../assets/scss/data/colour";
@use "../assets/scss/data/easing";
@use "../assets/scss/data/fontsize";
/* prettier-ignore */
.tags {
  visibility: hidden;
  overflow: hidden;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  height: 0;
  border: 1px dashed colour.$gunmetal-800;
  padding: 0.5rem;
  opacity: 0;
  transition:
    height 250ms easing.$ease-out-quart,
    margin-bottom 250ms easing.$ease-out-quart,
    opacity 175ms easing.$ease-in-quart;
  &[aria-expanded="true"] {
    visibility: visible;
    height: v-bind(setContainerHeight);
    margin-block: 1rem;
    opacity: 1;
  }
}
</style>

<script setup lang="ts">
// Types
import type { FormTagPropData } from "~/types/components/forms";

// Prop definitions
const props = defineProps({
  data: {
    type: Array as PropType<FormTagPropData[]>,
    required: true,
  },
  emitValue: {
    type: [Array, null] as PropType<FormTagPropData[] | null>,
    required: false,
  },
  isExpanded: {
    type: Boolean as PropType<boolean>,
    required: true,
  },
});

// Emit definitions
const emit = defineEmits<{
  (event: "update:emit-value", data: FormTagPropData[]): void;
  (event: "update:is-expanded", data: boolean): void;
}>();

// Emit handler
function emitHandler(): void {
  emit("update:emit-value", tags.value);
}

// Reactive variables
const tags: Ref<FormTagPropData[]> = ref([]);
const isSelected: Ref<boolean[]> = ref(Array(props.data.length).fill(false));

// Template refs
const tagsElement: Ref<HTMLElement | null> = ref(null);

// Computed properties
const setContainerHeight = computed(() => {
  // Tag count divided by number of columns multiplied by total height (including grid gaps)
  const height = Math.ceil(props.data.length / 3) * 2.5;
  // Tag count divided by number of columns multiplied by top/bottom border width
  const border = Math.ceil(props.data.length / 3) * 2;
  return `calc(${height}rem + ${border}px)`;
});

// Watchers
watch(
  () => props.emitValue,
  (data) => {
    if (!data) return;
    if (data.length === 0) {
      clearAll();
    }
  },
  { deep: true }
);

// Functions
function handleClick(data: FormTagPropData, event: MouseEvent): void {
  const tag = props.data.find((tag) => tag === data);
  const target = event.target as HTMLElement | null;
  if (!tag || !target) return;
  if (tags.value.includes(tag)) {
    removeTag(tag);
  } else {
    addTag(tag);
  }
  emitHandler();
  return;
}

function addTag(tag: FormTagPropData): void {
  tags.value.push(tag);
  isSelected.value[tag.index] = true;
}

function removeTag(tag: FormTagPropData): void {
  const index = tags.value.indexOf(tag);
  tags.value.splice(index, 1);
  isSelected.value[tag.index] = false;
}

function clearAll(): void {
  tags.value = [];
  isSelected.value = Array(props.data.length).fill(false);
}
</script>
