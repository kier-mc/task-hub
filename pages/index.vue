<template>
  <div class="temp">
    <p>Index page content</p>
    <p v-if="user">User is currently logged in: {{ user.email }}</p>
    <br />
    <p>
      <button
        class="button"
        type="button"
        @click="notifications.setMessage('A message', 'dev')"
      >
        Trigger Notification
      </button>
      <br />
      <br />
      <button
        class="button"
        type="button"
        @click="notifications.setMessage('Another message', 'dev')"
      >
        Trigger Separate Notification
      </button>
    </p>
    <div class="temp-divider">
      <FormHandler
        :formData="propData.formData[0]"
        v-model="vModelObject[propData.formData[0].formID]"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.temp {
  padding: 1rem;
  background-color: hsl(0, 0%, 17.5%);
}
.temp-divider {
  display: inline-block;
  margin-top: 3rem;
}
</style>

<script setup lang="ts">
const user = useSupabaseUser();
const notifications = useNotificationsStore();

function generateCountryData() {
  const payload = [];
  for (let i = 0; i < countriesHelper.length; i++) {
    const dataObject = {
      value: "",
      label: "",
    };
    dataObject.value = countriesHelper[i];
    dataObject.label = countriesHelper[i];
    payload.push(dataObject);
  }
  return payload;
}

const countryData: Ref<Array<any>> = ref(generateCountryData());

const propData = {
  formData: [
    {
      index: 0,
      formID: "autocomplete",
      elementType: "autocomplete",
      labelText: "Autocomplete Test",
      options: [...countryData.value],
    } as CompFormObject,
  ],
};
interface TemporaryInterface {
  [key: string]: string | undefined;
}
const vModelObject: TemporaryInterface = reactive({
  autocomplete: "",
});
</script>
