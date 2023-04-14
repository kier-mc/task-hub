<template>
  <div class="temp">
    <form class="login">
      <template v-for="formData in data" :key="formData.id">
        <MiniCompFormInput
          :formData="formData"
          v-model="credentials[formData.formID]"
        />
      </template>
      <button type="button" class="button" @click="handleClick">Submit</button>
      <br />
      <br />
      <br />
      {{ credentials }}
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
const data: Array<CompFormObject> = [
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

const credentials: Ref<{ [key: string]: string }> = ref({
  email: ref(""),
  password: ref(""),
});

async function handleClick() {
  // Only test for the presence of an @ symbol between two sets of indeterminate characters
  // Intended to help guide a user to input their email instead of an author name
  if (!/^.{1,}@.{1,}/.test(credentials.value.email)) {
    console.log("Invalid email");
    return;
  }
  if (credentials.value.password.length >= 12) {
    console.log("Password too short");
    return;
  }
}
</script>
