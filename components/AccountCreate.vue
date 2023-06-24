<template>
  <section class="stepper">
    <div class="stepper__timeline" ref="timeline">
      <ol class="timeline__list">
        <li
          class="timeline__step"
          v-for="entry in propData.formHandler"
          :key="entry.index"
          :data-active="activeSlide === entry.index ? true : false"
        >
          {{ entry.header }}
        </li>
      </ol>
    </div>
    <div v-if="isLoading" class="stepper__loading">
      <AppLoadingIndicator :options="propData.loadingIndicator" />
    </div>
    <template v-else>
      <div class="stepper__container" ref="container">
        <section
          class="entry"
          v-for="entry in propData.formHandler"
          :key="entry.index"
          :data-active="activeSlide === entry.index ? true : false"
        >
          <template v-for="(formData, index) in entry.formData" :key="index">
            <template v-if="entry.formData[index].elementType === 'input'">
              <FormHandler
                :formData="formData"
                v-model:input-element-value="rawCredentialData[formData.formID]"
              />
            </template>
            <template
              v-if="entry.formData[index].elementType === 'autocomplete'"
            >
              <FormHandler
                :formData="formData"
                v-model:input-element-value="rawCountryData.label"
                v-model:data-attribute-value="rawCountryData.value"
              />
            </template>
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
          {{
            activeSlide === propData.formHandler.length - 1 ? "Submit" : "Next"
          }}
        </button>
      </div>
    </template>
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
  }
  &__loading {
    display: flex;
    justify-content: center;
    align-items: center;
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
.timeline {
  &__list {
    position: relative;
    // Generates vertical line
    &::before {
      content: "";
      position: absolute;
      inset: 0;
      width: 1px;
      height: 100%;
      z-index: 20;
      border-radius: 0.25rem;
      margin-left: -0.5rem;
      background-color: hsl(0, 0%, 40%);
    }
  }
  &__step {
    position: relative;
    opacity: 0.5;
    width: max-content;
    list-style-type: none;
    &[data-active="true"] {
      opacity: 1;
      &::before {
        content: "";
        position: absolute;
        inset: 0;
        height: 2px;
        background-color: #3ab09e;
        transform-origin: left;
        animation: stage-pseudoelement 175ms ease-in-out 1 forwards;
      }
    }
    &:not(:last-child) {
      margin-bottom: 1.5rem;
    }
  }
}
@keyframes stage-pseudoelement {
  0% {
    opacity: 0;
    transform: scaleX(0) translate3d(0, 1.25rem, 0);
  }
  100% {
    opacity: 1;
    transform: scaleX(1) translate3d(0, 1.25rem, 0);
  }
}
.entry {
  opacity: 0;
  min-width: v-bind(contentWidth);
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
const countryData: Ref<Array<any>> = ref(generateCountryData());
/* Prop/v-model-related data */
const propData = {
  formHandler: [
    {
      index: 0,
      header: "Basic Information",
      formData: [
        {
          index: 0,
          formID: "email",
          elementType: "input",
          attrType: "email",
          autocomplete: "email",
          labelText: "Email",
          hintText: "Requires confirmation",
        },
        {
          index: 1,
          formID: "password",
          elementType: "input",
          attrType: "password",
          autocomplete: "new-password",
          labelText: "Password",
          hintText: "Password must be at least 12 characters long",
        },
      ],
    } as CreateAccountStepperData,
    {
      index: 1,
      header: "Personalisation",
      formData: [
        {
          index: 0,
          formID: "preferred_name",
          elementType: "input",
          attrType: "text",
          autocomplete: "given-name",
          labelText: "Preferred name",
          hintText: "Used when authoring tasks",
        },
        {
          index: 1,
          formID: "country",
          elementType: "autocomplete",
          labelText: "Country",
          hintText: "Used for providing precise weather information",
          options: [...countryData.value],
        },
        {
          index: 2,
          formID: "locale",
          elementType: "input",
          attrType: "text",
          autocomplete: "address-level2",
          labelText: "City/Town",
          hintText: "Used for providing precise weather information",
        },
      ],
    } as CreateAccountStepperData,
  ],
  loadingIndicator: {
    type: "dots",
    width: 48,
    height: 48,
    hue: 0,
    saturation: 0,
    lightness: 100,
  } as LoadingIndicatorData,
};
/* Reactive variables */
const activeSlide: Ref<number> = ref(0);
const step: Ref<number> = ref(0);
const current: Ref<number> = ref(0);
const credentials: ComputedRef<CompleteNewAccountCredentialData> = computed(
  () => {
    return {
      ...rawCredentialData,
      country: { ...rawCountryData },
    } as CompleteNewAccountCredentialData;
  }
);
const rawCredentialData: RawNewAccountCredentialData = reactive({
  email: undefined,
  password: undefined,
  preferred_name: undefined,
  locale: undefined,
});
const rawCountryData: AutocompleteCountryData = reactive({
  label: undefined,
  value: undefined,
});
const contentWidth: Ref<string> = ref("");
const isLoading: Ref<boolean> = ref(true);
/* Variables */
const STEPPER_WIDTH = 640 - 32;
/* Template refs */
const container: Ref<HTMLDivElement | null> = ref(null);
const timeline: Ref<HTMLDivElement | null> = ref(null);
/**
 * Calculates the content portion of the stepper. The content portion
 * is defined as the section of the stepper that displays form information,
 * and does not include the timeline.
 */
function determineContentWidth(): void {
  if (!timeline.value) return;
  contentWidth.value = `${STEPPER_WIDTH - timeline.value.clientWidth}px`;
}
/**
 * Calculates the width of a single step section in pixels.
 * Used for to determine "step" for CSS translation.
 */
function updateTransformStep(): void {
  if (!contentWidth.value) return;
  step.value = parseInt(contentWidth.value) * -1;
}
/**
 * Controls behaviour for "next"/"submit" button by updating activeSlide ref and translating container element.
 * If the active step is the last step in the sequence, calls createUser().
 * A ternary operator in the template controls the button text content.
 */
function nextStep(): void {
  if (!container.value) return;
  if (activeSlide.value < propData.formHandler.length - 1) {
    activeSlide.value += 1;
    current.value += step.value;
    container.value.style.transform = `translate3d(${current.value}px, 0, 0)`;
  } else {
    createUser(credentials);
  }
}
/**
 * Controls behaviour for "previous" button by updating activeSlide ref and translating container element.
 *
 */
function prevStep(): void {
  if (!container.value) return;
  if (activeSlide.value > 0) {
    activeSlide.value -= 1;
    current.value -= step.value;
    container.value.style.transform = `translate3d(${current.value}px, 0, 0)`;
  }
}
/* Calculate the transform step once all content is rendered to the DOM */
onMounted(() => {
  determineContentWidth();
  updateTransformStep();
  isLoading.value = false;
});
</script>
