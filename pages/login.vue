<template>
  <div class="temp">
    <form class="login" @keyup.enter="loginUser(ref(credentials))">
      <template v-for="formData in propData" :key="formData.id">
        <FormHandler
          :formData="formData"
          v-model:inputElementValue="credentials[formData.formID]"
        />
      </template>
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
const propData: Array<FormHandlerData> = [
  {
    index: 0,
    formID: "email",
    elementType: "input",
    attrType: "text",
    autocomplete: "email",
    labelText: "Email",
  },
  {
    index: 1,
    formID: "password",
    elementType: "input",
    attrType: "password",
    autocomplete: "current-password",
    labelText: "Password",
  },
];
const credentials: LoginCredentialsData = reactive({
  email: "",
  password: "",
});
</script>
