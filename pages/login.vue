<template>
  <div class="temp">
    <form class="login" @keyup.enter="loginWrapper(ref(credentials))">
      <div v-if="isLoading" class="modal">
        <AppLoadingIndicator
          class="modal__indicator"
          :options="propData.loadingIndicator"
        />
        <div class="modal__message">Logging in...</div>
      </div>
      <FormInput
        class="login__input"
        :form-data="propData.formHandler[0]"
        :disabled="isLoading"
        :aria-disabled="isLoading"
        v-model:emit-label="credentials.email"
      />
      <FormInput
        class="login__input"
        :form-data="propData.formHandler[1]"
        :disabled="isLoading"
        :aria-disabled="isLoading"
        v-model:emit-label="credentials.password"
      />
      <button
        type="button"
        class="button"
        :disabled="isLoading"
        :aria-disabled="isLoading"
        @click="loginWrapper(ref(credentials))"
      >
        Submit
      </button>
    </form>
  </div>
</template>

<style scoped lang="scss">
.temp {
  padding: 1rem;
  background-color: hsl(0, 0%, 17.5%);
}
.login {
  position: relative;
  max-width: 384px;
  padding: 1rem;
  margin: 0 auto;
  background-color: hsl(0, 0%, 20%);
  &__input {
    margin-bottom: 1rem;
  }
}
.modal {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
  background-color: hsla(0, 0%, 10%, 0.75);
  backdrop-filter: blur(4px);
  &__indicator {
    margin-bottom: 1rem;
  }
  &__message {
    user-select: none;
    font-size: 1.25rem;
  }
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
    type: "circle",
    size: {
      width: 48,
      height: 48,
    },
    colour: {
      hue: 0,
      saturation: 0,
      lightness: 100,
    },
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
