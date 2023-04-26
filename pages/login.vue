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
/* Type imports */
import { User } from "@supabase/gotrue-js";
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
/*
 * async loginUser(ref, credentials)
 * Attempts login via SupabaseAuthClient
 * @param credentials: object containing data to pass
 */
 async function loginUser(
  credentials: Ref<LoginCredentialsDataObject>
): Promise<void> {
  const { data, error } = await useSupabaseAuthClient().auth.signInWithPassword(
    {
      email: credentials.value.email,
      password: credentials.value.password,
    }
  );
  if (error) {
    notificationsStore.setMessage(error.message, "error");
    return;
  }
  notificationsStore.setMessage(
    `Logged in as ${(data.user as User).user_metadata.name}`,
    "success"
  );
}
</script>
