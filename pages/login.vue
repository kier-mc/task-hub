<template>
  <div class="temp">
    <form class="login" @keyup.enter="loginUser(ref(credentials))">
      <div v-if="isLoading" class="modal">
        <AppLoadingIndicator
          class="modal__indicator"
          :options="propData.loadingIndicator"
        />
        <div class="modal__message">Logging in...</div>
      </div>
      <FormHandler
        class="login__input"
        :form-data="propData.formHandler[0]"
        :disabled="isLoading"
        :aria-disabled="isLoading"
        v-model:emit-value="credentials.email"
      />
      <FormHandler
        class="login__input"
        :form-data="propData.formHandler[1]"
        :disabled="isLoading"
        :aria-disabled="isLoading"
        v-model:emit-value="credentials.password"
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
      formID: "email",
      elementType: "input",
      attrType: "email",
      autocomplete: "email",
      labelText: "Email",
    } as FormHandlerData,
    {
      index: 1,
      formID: "password",
      elementType: "input",
      attrType: "password",
      autocomplete: "current-password",
      labelText: "Password",
    } as FormHandlerData,
  ],
  loadingIndicator: {
    type: "circle",
    width: 48,
    height: 48,
    hue: 0,
    saturation: 0,
    lightness: 100,
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
