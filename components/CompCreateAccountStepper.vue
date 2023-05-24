<template>
  <section class="stepper">
    <div class="stepper__timeline">
      <ol>
        <li
          v-for="entry in propData"
          :key="entry.index"
          :data-active="activeSlide === entry.index ? true : false"
        >
          {{ entry.header }}
        </li>
      </ol>
    </div>
    <div class="stepper__container" ref="container">
      <section
        class="entry"
        v-for="entry in propData"
        :key="entry.index"
        :data-active="activeSlide === entry.index ? true : false"
      >
        <template v-for="formData in entry.formData">
          <CompFormHandler
            :formData="formData"
            v-model="credentials[formData.formID]"
          />
        </template>
      </section>
    </div>
    <div class="stepper__controls">
      <button
        type="button"
        class="button"
        @click="prevStep()"
        :disabled="activeSlide === 0 ? true : false"
      >
        Previous
      </button>
      <button type="button" class="button" @click="nextStep()">
        {{ activeSlide === propData.length - 1 ? "Submit" : "Next" }}
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
  max-width: 640px;
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
        transform: translate3d(0, var(--height-offset), 0);
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
/* Reactive variables */
const activeSlide: Ref<number> = ref(0);
const step: Ref<number> = ref(0);
const current: Ref<number> = ref(0);
/* Template refs */
const container: Ref<HTMLElement | null> = ref(null);
/* Prop/v-model-related data */
const propData: Array<CompStepperPropData> = [
  {
    index: 0,
    header: "Required Information",
    formData: [
      {
        index: 0,
        formID: "email",
        elementType: "input",
        attrType: "email",
        labelText: "Email",
        hintText: "Requires confirmation",
      },
      {
        index: 1,
        formID: "password",
        elementType: "input",
        attrType: "password",
        labelText: "Password",
        hintText: "Password must be at least 12 characters long",
      },
    ],
  },
  {
    index: 1,
    header: "Personalisation",
    formData: [
      {
        index: 0,
        formID: "name",
        elementType: "input",
        attrType: "text",
        labelText: "Preferred name",
        hintText: "Used when authoring tasks",
      },
    ],
  },
];
const credentials: NewAccountDataObject = reactive({
  email: "",
  password: "",
  name: "",
});
/*
 * updateTransformStep()
 * Calculates the width of a single step section in pixels
 * Used for to determine "step" for CSS translation
 */
function updateTransformStep(): void {
  if (!container.value) return;
  step.value = (container.value.clientWidth / propData.length) * -1;
}
/*
 * nextStep(event)
 * Controls behaviour for "next"/"submit" button
 * If the active step is the last step, calls createUser()
 * A ternary operator in the template controls button text
 */
function nextStep(): void {
  if (!container.value) return;
  if (activeSlide.value < propData.length - 1) {
    activeSlide.value += 1;
    current.value += step.value;
    container.value.style.transform = `translate3d(${current.value}px, 0, 0)`;
  } else {
    createUser(ref(credentials));
  }
}
/*
 * prevStep(event)
 * Controls behaviour for "previous" button
 */
function prevStep(): void {
  if (!container.value) return;
  if (activeSlide.value > 0) {
    activeSlide.value -= 1;
    current.value -= step.value;
    container.value.style.transform = `translate3d(${current.value}px, 0, 0)`;
  }
}
onMounted(() => {
  updateTransformStep();
});
</script>
