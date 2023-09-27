<template>
  <section class="container__filter">
    <section class="tags">
      <div v-for="tag in propData.data.checkbox" class="option">
        <input
          class="option__checkbox"
          type="checkbox"
          :id="`tag-${tag.label}`"
          :name="`tag-${tag.label}`"
          :value="tag"
          v-model="filterTags"
        />
        <label class="option__label" :for="`tag-${tag.label}`">{{
          tag.label
        }}</label>
      </div>
    </section>
  </section>
</template>

<style scoped lang="scss">
@use "../assets/scss/data/colour";
@use "../assets/scss/data/effect";
@use "../assets/scss/data/fontsize";
@use "../assets/scss/data/layout";
.container__filter {
  width: 40ch;
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
.tags {
  display: grid;
  grid-template-columns: repeat(2, auto);
  gap: 0.5rem;
  padding: 1rem;
  background-color: colour.$window-body;
}
.option {
  &__checkbox {
    margin-right: 0.5rem;
  }
  &__label {
    text-transform: capitalize;
  }
}
</style>

<script setup lang="ts">
// Types
import type { TagData } from "~/types/schema";

// Prop definitions
const props = defineProps({
  emitTags: {
    type: Array as PropType<TagData[]>,
  },
});

// Emit definitions
const emit = defineEmits<{
  (event: "update:emit-tags", data: TagData[]): void;
}>();

// Prop data
const propData = {
  data: <Record<string, TagData[]>>{
    checkbox: [...$tasks.tags.getPropData()],
  },
};

// Reactive variables
const filterTags: Ref<TagData[]> = ref([]);

// Watchers
watch(filterTags, () => {
  emit("update:emit-tags", filterTags.value);
});
</script>
