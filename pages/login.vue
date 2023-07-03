<template>
  <div class="temp">
    <form class="login" @keyup.enter="loginUser(ref(credentials))">
      <FormHandler
        :form-data="propData.formHandler[0]"
        v-model:emit-value="credentials.email"
      />
      <FormHandler
        :form-data="propData.formHandler[1]"
        v-model:emit-value="credentials.password"
      />
      <button type="button" class="button" @click="loginUser(ref(credentials))">
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
  width: max-content;
  max-width: 640px;
  padding: 1rem;
  border-radius: 0.5rem;
  margin: 0 auto;
  background-color: hsl(0, 0%, 20%);
}
</style>

<script setup lang="ts">
/* Prop/v-model-related data */
const propData = {
  formHandler: [
    {
      index: 0,
      formID: "email",
      elementType: "input",
      attrType: "text",
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
};
const credentials: LoginCredentialsData = reactive({
  email: null,
  password: null,
});
</script>
