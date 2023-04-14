<template>
  <section class="stepper">
    <div class="stepper__timeline">
      <ol>
        <li
          v-for="entry in props.data"
          :key="entry.index"
          :data-active="active === entry.index ? true : false"
        >
          {{ entry.header }}
        </li>
      </ol>
    </div>
    <div class="stepper__container" ref="container">
      <section
        class="entry"
        v-for="entry in props.data"
        :key="entry.index"
        :data-active="active === entry.index ? true : false"
      >
        <template v-for="formData in entry.formData">
          <MiniCompFormInput :formData="formData" />
        </template>
      </section>
    </div>
    <div class="stepper__controls">
      <button
        type="button"
        class="button"
        @click="prevStep($event)"
        :disabled="active === 0 ? true : false"
      >
        Previous
      </button>
      <button type="button" class="button" @click="nextStep($event)">
        {{ active === props.data.length - 1 ? "Submit" : "Next" }}
      </button>
    </div>
  </section>
</template>

<style scoped lang="scss">
.stepper {
  isolation: isolate;
  overflow: hidden;
  display: grid;
  grid-template-columns: max-content auto;
  column-gap: 1rem;
  max-width: 600px;
  padding: 1rem;
  border-radius: 0.5rem;
  margin: 0 auto;
  background-color: hsl(0, 0%, 20%);
  cursor: default;
  &__timeline {
    // Adjusts box in line with parent padding to hide section transitions
    // Unresponsive; should be tied to variable or similar and have values calculated
    padding-left: 1.5rem;
    margin-left: -1rem;
    z-index: 10;
    // End
    padding-right: 1rem;
    border-right: 1px dashed hsl(0, 0%, 40%);
    background-color: inherit;
    & ol {
      // Not fully implemented
      // Adjusting height offset value via JS allows transform of after pseudoelement
      --height-offset: 1.25rem;
      position: relative;
      // Generates vertical line
      &::before {
        content: "";
        position: absolute;
        inset: 0;
        width: 1px;
        height: 100%;
        border-radius: 0.25rem;
        margin-left: -0.5rem;
        z-index: 20;
        background-color: hsl(0, 0%, 40%);
      }
      // Not fully implemented
      // Generates "section divider"
      &::after {
        content: "";
        position: absolute;
        inset: 0;
        transform: translateY(var(--height-offset));
        height: 2px;
        background: #3ab09e;
        transition: transform 150ms;
      }
    }
    & li {
      position: relative;
      opacity: 0.5;
      list-style-type: none;
      transition: opacity 175ms;
      &[data-active="true"] {
        opacity: 1;
      }
      &:not(:last-child) {
        margin-bottom: 1.5rem;
      }
    }
  }
  &__container {
    display: flex;
    transition: transform 175ms;
  }
  &__controls {
    grid-column: 2 / span all;
    margin-top: 1rem;
  }
}
.entry {
  opacity: 0;
  filter: blur(0.125rem);
  transition: opacity 200ms, filter 150ms;
  &[data-active="true"] {
    opacity: 1;
    filter: none;
  }
}

.button {
  &:not(:last-child) {
    margin-right: 1rem;
  }
}
</style>

<script setup lang="ts">
const props = defineProps({
  data: { type: Array as PropType<CompStepperPropData[]>, required: true },
});
const active: Ref<number> = ref(0);
const container: Ref<HTMLElement | null> = ref(null);
const step: Ref<number> = ref(0);
const current: Ref<number> = ref(0);
const prefersReducedMotion = ref(false);

function updateTransformStep(): void {
  if (!props.data) return;
  if (!container.value) return;
  step.value = (container.value.clientWidth / props.data.length) * -1;
}

function nextStep(event: Event): void {
  if (!props.data) return;
  if (!container.value) return;
  if (active.value < props.data.length - 1) {
    active.value += 1;
    current.value += step.value;
    container.value.style.transform = `translateX(${current.value}px)`;
  }
}

function prevStep(event: Event): void {
  if (!container.value) return;
  if (active.value > 0) {
    active.value -= 1;
    current.value -= step.value;
    container.value.style.transform = `translateX(${current.value}px)`;
  }
}

// Seemingly doubles the speed of transitions for some reason
// Might just be the effect of transform without a transition?
function setTransitions() {
  if (!container.value) return;
  if (prefersReducedMotion) {
    container.value.style.transition = "none";
  }
}

onMounted(() => {
  updateTransformStep();
  prefersReducedMotion.value = window.matchMedia(
    `(prefers-reduced-motion)`
  ).matches;
  // setTransitions();
});
</script>
