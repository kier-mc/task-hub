<template>
  <div ref="tagsElement" class="tags" :aria-expanded="props.isExpanded">
    <FormTag
      v-for="(tag, index) in props.data"
      :key="index"
      :data="tag"
      :class="setTagClass(tag)"
      @click="handleClick(tag)"
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
// prettier-ignore
.tag {
  all: unset;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2rem;
  border: 1px solid colour.$gunmetal-500;
  border-radius: 0.2rem;
  background-color: colour.$gunmetal-600;
  color: colour.$font-light;
  text-align: center;
  transition:
    background-color easing.$ease-out-quart 500ms,
    transform easing.$ease-out-quart 100ms;
  cursor: pointer;
  &:hover {
  transform: scale(1.05);
  background-color: colour.$gunmetal-500;
  }
  &--selected {
    border: 1px solid colour.$mint-300;
    background-color: colour.$mint-400;
    &:hover {
      background-color: colour.$mint-400;
    }
  }
}
</style>

<script setup lang="ts">
// Types
import type { TagData } from "~/types/schema";

// Prop definitions
const props = defineProps({
  data: {
    type: Array as PropType<TagData[]>,
    required: true,
  },
  selectedTags: {
    type: Array as PropType<TagData[]>,
    required: true,
  },
  isExpanded: {
    type: Boolean as PropType<boolean>,
    required: true,
  },
});

// Emit definitions
const emit = defineEmits<{
  (event: "update:selected-tags", data: TagData[]): void;
  (event: "update:is-expanded", data: boolean): void;
}>();

// Emit handler
function emitHandler(): void {
  emit("update:selected-tags", tags.value);
}

// Reactive variables
const tags: Ref<TagData[]> = ref(props.selectedTags || []);

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

const setTagClass = computed(() => (tag: TagData) => {
  const selectedTags = props.selectedTags.map((tag) => tag.tag_id);
  return selectedTags.includes(tag.tag_id) ? "tag tag--selected" : "tag";
});

// Watchers
watch(
  () => props.selectedTags,
  () => {
    tags.value = props.selectedTags;
    // console.log(props.selectedTags.map((tag) => tag.tag_id));
    emitHandler();
  },
  { immediate: true, deep: true }
);

// Functions
function handleClick(tag: TagData): void {
  const selectedTags = props.selectedTags.map((tag) => tag.tag_id);
  if (selectedTags.includes(tag.tag_id)) {
    removeTag(tag);
  } else {
    addTag(tag);
  }
}

function addTag(tag: TagData): void {
  tags.value.push(tag);
}

function removeTag(tag: TagData): void {
  const index = tags.value.indexOf(tag);
  tags.value.splice(index, 1);
}
</script>
