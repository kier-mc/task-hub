<template>
  <div class="container__create-account">
    <article class="create-account">
      <header class="header">
        <h2 class="header__title">Create Account</h2>
      </header>
      <ol class="timeline">
        <li
          class="timeline__step"
          v-for="step in propData.data.form"
          :key="step.index"
          :data-active="step.index === stepper.slide.active"
        >
          {{ step.label }}
        </li>
      </ol>
      <form ref="form" class="form">
        <div class="form__steps">
          <section
            class="form__step"
            v-for="(section, index) in propData.data.form"
            :key="section.index"
            :data-active="stepper.slide.active === index"
          >
            <template v-for="data in section.data">
              <template v-if="data.type === 'input'">
                <FormInput
                  :key="data.index"
                  class="form__input"
                  :data="data"
                  :is-disabled="data.section !== stepper.slide.active"
                  v-model:emit-value="credentials[data.attributes.id]"
                />
              </template>
              <template v-else-if="data.type === 'autocomplete'">
                <FormAutocomplete
                  :key="data.index"
                  class="form__autocomplete"
                  :data="data"
                  :is-sorted="true"
                  :is-disabled="data.section !== stepper.slide.active"
                  v-model:emit-term="receiver.term"
                  v-model:emit-data="receiver.data"
                />
              </template>
            </template>
          </section>
        </div>
        <div class="form__buttons">
          <AppButton
            class="form__button"
            :data="propData.data.button[0]"
            :is-disabled="stepper.slide.active === 0"
          />
          <template v-if="stepper.slide.active < propData.data.form.length - 1">
            <AppButton class="form__button" :data="propData.data.button[1]" />
          </template>
          <template v-else>
            <AppButton
              class="form__button"
              :data="propData.data.button[2]"
              :is-disabled="setSubmitDisabledState"
              :is-loading="isLoading"
            />
          </template>
        </div>
      </form>
    </article>
  </div>
</template>

<style scoped lang="scss">
@use "../assets/scss/data/colour";
@use "../assets/scss/data/effect";
@use "../assets/scss/data/layout";
.container__create-account {
  position: relative;
  max-width: 40ch;
  padding-top: 2rem;
  margin-inline: auto;
  @media (max-width: layout.$breakpoint-sm) {
    max-width: calc(100% - 2rem);
  }
}
.create-account {
  box-shadow: effect.$drop-shadow-md;
  background-color: colour.$window-body;
}
.header {
  display: flex;
  align-items: center;
  height: 3rem;
  padding-inline: 1rem;
  margin-inline: auto;
  background-image: colour.$window-title;
  color: colour.$font-light;
  &__title {
    all: unset;
    font-size: 1.025rem;
    font-weight: bold;
  }
}
.timeline {
  all: unset;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 4rem;
  &__step {
    position: relative;
    display: flex;
    align-items: center;
    padding-inline: 1rem;
    margin-top: 1rem;
    height: 2rem;
    transition: border 200ms ease-in-out;
    &[data-active="true"] {
      font-weight: bold;
      &::before {
        opacity: 1;
      }
    }
    &::before {
      content: "";
      opacity: 0;
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      height: 2px;
      background-color: colour.$cerise-500;
    }
  }
}
.form {
  overflow-x: hidden;
  padding: 1rem;
  margin-inline: auto;
  &__steps {
    position: relative;
    display: flex;
    gap: 2rem;
    z-index: 20;
    transform: v-bind(translation);
    transition: transform 200ms ease-in-out;
  }
  &__step {
    box-sizing: content-box;
    display: flex;
    flex-direction: column;
    min-width: calc(37ch - 2px);
    @media (max-width: layout.$breakpoint-sm) {
      min-width: calc(100%);
    }
  }
  &__input,
  &__autocomplete {
    &:not(:last-of-type) {
      margin-bottom: 1rem;
    }
  }
  &__buttons {
    display: flex;
    z-index: 10;
    margin-top: 4rem;
  }
  &__button {
    width: 100%;
    &:not(:first-child) {
      margin-left: 1rem;
    }
  }
}
</style>

<script setup lang="ts">
// Types
import type {
  FormInputPropData,
  NewAccountSectionPropData,
  FormAutocompletePropData,
} from "~/types/components/forms";
import type { ButtonPropData } from "~/types/components/app";
import type { NewAccountCredentialData } from "~/types/credentials";
import type { AutocompleteEmitCountryData } from "~/types/components/forms";
// Components
import { SVGLogin } from "#components";

// Props
const propData = {
  data: {
    form: <NewAccountSectionPropData[]>[
      {
        index: 0,
        label: "Basic Information",
        data: [
          <FormInputPropData>{
            index: 0,
            section: 0,
            type: "input",
            label: "Email",
            hint: "Requires confirmation",
            attributes: {
              autocomplete: "email",
              id: "email",
              type: "email",
            },
          },
          <FormInputPropData>{
            index: 1,
            section: 0,
            type: "input",
            label: "Password",
            hint: "Password must be at least 12 characters long",
            attributes: {
              autocomplete: "new-password",
              id: "password",
              type: "password",
            },
          },
        ],
      },
      {
        index: 1,
        label: "Personalisation",
        data: [
          <FormInputPropData>{
            index: 2,
            section: 1,
            type: "input",
            label: "Preferred name",
            hint: "Used when authoring tasks",
            attributes: {
              autocomplete: "given-name",
              id: "name",
              type: "text",
            },
          },
          <FormAutocompletePropData>{
            index: 3,
            section: 1,
            type: "autocomplete",
            label: "Country",
            hint: "Used for providing precise weather information",
            attributes: {
              id: "country",
            },
            options: $countries.generateAutocompleteData(),
          },
          <FormInputPropData>{
            index: 4,
            section: 1,
            type: "input",
            label: "City/Town",
            hint: "Used for providing precise weather information",
            attributes: {
              autocomplete: "address-level2",
              id: "locale",
              type: "text",
            },
          },
        ],
      },
    ],
    button: <ButtonPropData[]>[
      {
        function: () => prevStep(),
        label: "Previous",
        attributes: {
          type: "button",
        },
      },
      {
        function: () => nextStep(),
        label: "Next",
        attributes: {
          type: "button",
        },
      },
      {
        function: () => createUserWrapper(credentials.value),
        label: "Submit",
        icon: SVGLogin,
        attributes: {
          type: "button",
        },
      },
    ],
  },
};

// Reactive variables
const isLoading: Ref<boolean> = ref(false);
const timeout: Ref<NodeJS.Timeout | null> = ref(null);
const stepper = ref({
  size: 0,
  translation: 0,
  slide: {
    active: 0,
  },
});
const receiver: Ref<AutocompleteEmitCountryData> = ref({
  term: null,
  data: {
    country_id: null,
    country_name: null,
    iso_code: null,
  },
});
const credentials: Ref<NewAccountCredentialData> = ref({
  email: null,
  password: null,
  name: null,
  location: null,
  locale: null,
});

// Watchers
watch(receiver.value, () => {
  credentials.value.location = receiver.value.data;
});

// Template refs
const form: Ref<HTMLFormElement | null> = ref(null);

// Computed properties
const translation = computed(() => {
  return `translateX(${stepper.value.translation * -1}px)`;
});

const setSubmitDisabledState = computed(() => {
  return !$app.allRefValuesArePopulated(ref(credentials));
});

// Logic
function prevStep(): void {
  if (stepper.value.slide.active >= 1) {
    stepper.value.slide.active -= 1;
    stepper.value.translation -= stepper.value.size;
  }
}
function nextStep(): void {
  if (stepper.value.slide.active < propData.data.form.length - 1) {
    stepper.value.slide.active += 1;
    stepper.value.translation += stepper.value.size;
  }
}

function getWidth(): number {
  if (!form.value) return 0;
  return form.value.clientWidth;
}

function updateWidth(): void {
  if (timeout.value) clearTimeout(timeout.value);
  timeout.value = setTimeout(() => {
    const width = getWidth();
    stepper.value.size = width;
    stepper.value.translation = stepper.value.slide.active * width;
  }, 100);
}

function createUserWrapper(credentials: NewAccountCredentialData): void {
  isLoading.value = true;
  createUser(ref(credentials));
  isLoading.value = false;
}

// Hooks
onMounted(() => {
  stepper.value.size = getWidth();
  useEventListener(window, "resize", () => {
    updateWidth();
  });
});
</script>
