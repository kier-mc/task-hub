<template>
  <div class="temp">
    <form class="login">
      <template v-for="formData in propData" :key="formData.id">
        <MiniCompFormInput
          :formData="formData"
          v-model="credentials[formData.formID]"
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
/* Reactive variables */
const notificationsStore = useNotificationsStore();
/* Template refs */
/* Prop/v-model-related data */
const propData: Array<CompFormObject> = [
  {
    index: 0,
    formID: "email",
    attrType: "text",
    labelText: "Email",
  },
  {
    index: 1,
    formID: "password",
    attrType: "password",
    labelText: "Password",
  },
];
const credentials: LoginCredentialsDataObject = reactive({
  email: "",
  password: "",
});
</script>
