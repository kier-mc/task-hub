<template>
  <div class="container-login">
    <header class="header">
      <h2 class="header__title">Login</h2>
    </header>
    <form class="login" @keyup.enter="loginWrapper(ref(credentials))">
      <FormInput
        class="login__input"
        :data="propData.formHandler[0]"
        :is-disabled="isLoading"
        :aria-disabled="isLoading"
        v-model:emit-label="credentials.email"
      />
      <FormInput
        class="login__input"
        :data="propData.formHandler[1]"
        :is-disabled="isLoading"
        :aria-disabled="isLoading"
        v-model:emit-label="credentials.password"
      />
      <FormButton
        class="login__button"
        :data="propData.buttonData"
        :is-disabled="isLoading"
        :is-loading="isLoading"
      />
    </form>
  </div>
</template>

<style scoped lang="scss">
@use "../assets/scss/data/colour";
@use "../assets/scss/data/effect";
@use "../assets/scss/data/layout";
.container-login {
  max-width: 35ch;
  margin-inline: auto;
  margin-top: 2rem;
  box-shadow: effect.$drop-shadow-2;
  @media (max-width: layout.$breakpoint-medium) {
    max-width: calc(100% - 2rem);
  }
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
.login {
  position: relative;
  padding: 1rem;
  margin-inline: auto;
  background-color: colour.$window-body;
  &__input {
    margin-bottom: 1rem;
  }
  &__button {
    margin-left: auto;
  }
}
</style>

<script setup lang="ts">
import { SVGLogin } from "#components";
/* Prop data */
const propData = {
  formHandler: [
    {
      index: 0,
      type: "input",
      label: "Email",
      attributes: {
        autocomplete: "email",
        id: "email",
        type: "email",
      },
    } as FormHandlerData,
    {
      index: 1,
      type: "input",
      label: "Password",
      attributes: {
        autocomplete: "current-password",
        id: "password",
        type: "password",
      },
    } as FormHandlerData,
  ],
  buttonData: {
    function: () => loginWrapper(ref(credentials)),
    label: "Login",
    icon: SVGLogin,
    attributes: {
      type: "button",
    },
  } as FormButtonData,
  loadingIndicator: {
    type: "dots",
  } as LoadingIndicatorData,
};

const credentials: LoginCredentialsData = reactive({
  email: null,
  password: null,
});

const isLoading: Ref<boolean> = ref(false);

async function loginWrapper(credentials: Ref<LoginCredentialsData>) {
  isLoading.value = true;
  await loginUser(credentials);
  isLoading.value = false;
}
</script>
