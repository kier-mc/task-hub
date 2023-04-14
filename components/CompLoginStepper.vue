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
          <MiniCompFormInput
            :formData="formData"
            v-model="newUserDetails[formData.formID]"
          />
        </template>
      </section>
    </div>
    <div class="stepper__controls">
      <button
        type="button"
        class="button"
        @click="prevStep($event)"
        :disabled="activeSlide === 0 ? true : false"
      >
        Previous
      </button>
      <button type="button" class="button" @click="nextStep($event)">
        {{ activeSlide === propData.length - 1 ? "Submit" : "Next" }}
      </button>
    </div>
  </section>
  {{ newUserDetails }}
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
import * as argon2 from "argon2";

const activeSlide: Ref<number> = ref(0);
const container: Ref<HTMLElement | null> = ref(null);
const step: Ref<number> = ref(0);
const current: Ref<number> = ref(0);

const propData: Array<CompStepperPropData> = [
  {
    index: 0,
    header: "Required Information",
    formData: [
      {
        index: 0,
        formID: "email",
        attrType: "text",
        labelText: "Email",
        hintText: "Requires confirmation",
      },
      {
        index: 1,
        formID: "password",
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
        attrType: "text",
        labelText: "Preferred name",
        hintText: "Used when authoring tasks",
      },
    ],
  },
];

const newUserDetails: Ref<{ [key: string]: string }> = ref({
  email: "",
  password: "",
  name: "",
});

function updateTransformStep(): void {
  if (!container.value) return;
  step.value = (container.value.clientWidth / propData.length) * -1;
}

function nextStep(event: Event): void {
  if (!container.value) return;
  if (activeSlide.value < propData.length - 1) {
    activeSlide.value += 1;
    current.value += step.value;
    container.value.style.transform = `translateX(${current.value}px)`;
  } else {
    createUser();
  }
}

function prevStep(event: Event): void {
  if (!container.value) return;
  if (activeSlide.value > 0) {
    activeSlide.value -= 1;
    current.value -= step.value;
    container.value.style.transform = `translateX(${current.value}px)`;
  }
}

async function createUser() {
  const { data, error } = await useSupabaseAuthClient().auth.signUp({
    email: newUserDetails.value.email,
    password: newUserDetails.value.password,
    options: {
      data: {
        name: newUserDetails.value.name,
      },
    },
  });
  // Supabase doesn't return a message by default if the email is already registered
  // https://github.com/supabase/supabase-js/issues/296#issuecomment-1372552875
  if (data?.user?.identities?.length === 0) {
    console.log("This email is already registered");
    return;
  }
  if (error) {
    console.log(error);
  } else {
    console.log("Account created");
    console.log(data);
  }
}

onMounted(() => {
  updateTransformStep();
});
</script>
