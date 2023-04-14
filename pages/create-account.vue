<template>
  <div class="temp">
    <CompStepper :data="data" />
  </div>
</template>

<style scoped lang="scss">
.temp {
  padding: 1rem;
  background-color: hsl(0, 0%, 17.5%);
}
</style>

<script setup lang="ts">
const data: Array<CompStepperPropData> = [
  {
    index: 0,
    header: "Required Information",
    formData: [
      {
        index: 0,
        formID: "email",
        attrType: "text",
        labelText: "Email",
        hintText: "Requires confirmation",
      },
      {
        index: 1,
        formID: "password",
        attrType: "password",
        labelText: "Password",
        hintText: "Password must be at least 12 characters long",
      },
    ],
  },
  {
    index: 1,
    header: "Optional Information",
    formData: [
      {
        index: 0,
        formID: "phone",
        attrType: "text",
        labelText: "Phone number",
        hintText: "Used for optional 2FA",
      },
    ],
  },
  {
    index: 2,
    header: "Personalisation",
    formData: [
      {
        index: 0,
        formID: "preferred-name",
        attrType: "text",
        labelText: "Preferred name",
        hintText: "Used when authoring tasks",
      },
    ],
  },
];
</script>
