<template>
  <div class="container-login">
    <header class="header">
      <h2 class="header__title">Login</h2>
    </header>
    <form class="login" @keyup.enter="loginWrapper(ref(credentials))">
      <FormInput
        class="login__input"
        :form-data="propData.formHandler[0]"
        :is-disabled="isLoading"
        :aria-disabled="isLoading"
        v-model:emit-label="credentials.email"
      />
      <FormInput
        class="login__input"
        :form-data="propData.formHandler[1]"
        :is-disabled="isLoading"
        :aria-disabled="isLoading"
        v-model:emit-label="credentials.password"
      />

      <button
        ref="button"
        type="button"
        class="app-button submit-button"
        :disabled="isLoading"
        :aria-disabled="isLoading"
        @click="loginWrapper(ref(credentials))"
      >
        <Transition name="transition-fade-opacity">
          <AppLoadingIndicator
            v-if="isLoading"
            class="submit-button__loading"
            :options="propData.loadingIndicator"
          />
          <div v-else class="submit-button__label">Submit</div>
        </Transition>
      </button>
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
  border: 1px solid rgba(255, 255, 255, 0.18);
  &__input {
    margin-bottom: 1rem;
  }
}
.submit-button {
  width: v-bind(buttonWidth);
  margin-left: auto;
  &__loading {
    position: absolute;
    inset: 0;
    height: inherit;
    margin-inline: auto;
    fill: colour.$font-light;
  }
}
.transition-fade-opacity-enter-active,
.transition-fade-opacity-leave-active {
  visibility: visible;
  opacity: 1;
  transition: opacity 200ms ease, visibility 200ms ease;
}

.transition-fade-opacity-enter-from,
.transition-fade-opacity-leave-to {
  visibility: hidden;
  opacity: 0;
}
</style>

<script setup lang="ts">
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
  loadingIndicator: {
    type: "dots",
  } as LoadingIndicatorData,
};

const credentials: LoginCredentialsData = reactive({
  email: null,
  password: null,
});

const isLoading: Ref<boolean> = ref(false);
const buttonWidth: Ref<string> = ref("initial");

const button: Ref<HTMLButtonElement | null> = ref(null);

async function loginWrapper(credentials: Ref<LoginCredentialsData>) {
  isLoading.value = true;
  await loginUser(credentials);
  isLoading.value = false;
}

function getInitialButtonWidth() {
  if (!button.value) return;
  buttonWidth.value = `${button.value.clientWidth}px`;
}

onMounted(() => {
  getInitialButtonWidth();
});
</script>
