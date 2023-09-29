<template>
  <div class="container__login">
    <article class="login">
      <header class="header">
        <h2 class="header__title">Login</h2>
      </header>
      <form class="form" @keyup.enter="loginWrapper(ref(credentials))">
        <FormInput
          class="form__input"
          :data="propData.data.form[0]"
          :is-disabled="state.is_disabled"
          :aria-disabled="state.is_disabled"
          v-model:emit-value="credentials.email"
        />
        <FormInput
          class="form__input"
          :data="propData.data.form[1]"
          :is-disabled="state.is_disabled"
          :aria-disabled="state.is_disabled"
          v-model:emit-value="credentials.password"
        />
        <AppButton
          class="form__button"
          :data="propData.data.button"
          :is-disabled="state.is_disabled"
          :is-loading="state.is_loading"
        />
      </form>
    </article>
  </div>
</template>

<style scoped lang="scss">
@use "../assets/scss/data/colour";
@use "../assets/scss/data/effect";
@use "../assets/scss/data/layout";
.container__login {
  max-width: 40ch;
  margin-inline: auto;
  padding-top: 2rem;
  @media (max-width: layout.$breakpoint-md) {
    max-width: calc(100% - 2rem);
  }
}
.login {
  box-shadow: effect.$drop-shadow-md;
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
.form {
  position: relative;
  padding: 1rem;
  margin-inline: auto;
  background-color: colour.$window-body;
  &__input {
    margin-bottom: 1rem;
  }
  &__button {
    width: calc(100% - 1rem);
  }
}
</style>

<script setup lang="ts">
// Types
import type { ButtonPropData } from "~/types/components/app";
import type { FormInputPropData } from "~/types/components/forms";
import type { LoginCredentialData } from "~/types/credentials";

// Components
import { SVGLogin } from "#components";

// Meta
definePageMeta({ middleware: "public-only" });

// Props
const propData = {
  data: {
    form: <FormInputPropData[]>[
      {
        index: 0,
        type: "input",
        label: "Email",
        attributes: {
          autocomplete: "email",
          id: "email",
          type: "email",
        },
      },
      {
        index: 1,
        type: "input",
        label: "Password",
        attributes: {
          autocomplete: "current-password",
          id: "password",
          type: "password",
        },
      },
    ],
    button: <ButtonPropData>{
      function: () => loginWrapper(credentials),
      label: "Login",
      icon: SVGLogin,
      attributes: {
        type: "button",
      },
    },
  },
};

// Reactive variables
const state: Ref<Record<string, boolean>> = ref({
  is_loading: false,
  is_disabled: false,
});
const credentials: Ref<LoginCredentialData> = ref({
  email: null,
  password: null,
});

// Logic
async function loginWrapper(
  credentials: Ref<LoginCredentialData>
): Promise<void> {
  state.value.is_loading = true;
  state.value.is_disabled = true;
  const attempt = await loginUser(credentials);
  if (attempt) {
    state.value.is_loading = false;
    return;
  }
  state.value.is_loading = false;
  state.value.is_disabled = false;
}
</script>
