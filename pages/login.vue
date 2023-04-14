<template>
  <div class="temp">
    <form class="login">
      <template v-for="formData in data">
        <MiniCompFormInput :formData="formData" />
      </template>
      <button type="button" class="button">Submit</button>
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
</script>
