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
    <div class="temp-divider" style="display: inline-block">
      <FormHandler
        :formData="propData.formData[0]"
        v-model:inputElementValue="objectToConcat.label"
        v-model:dataAttributeValue="objectToConcat.value"
      />
    </div>
    <div class="temp-divider">
      {{ object1 }}
    </div>
    <div class="temp-divider">
      {{ objectToConcat }}
    </div>
    <div class="temp-divider">
      {{ upsertObjects2 }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.temp {
  padding: 1rem;
  background-color: hsl(0, 0%, 17.5%);
}
.temp-divider {
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
    } as FormHandlerData,
  ],
};
interface TemporaryInterface {
  [key: string]: Object | undefined;
  autocomplete: {
    label: string;
    value: string;
  };
}
const vModelObject: TemporaryInterface = reactive({
  autocomplete: { label: "", value: "" },
});

const object1: Object1Interface = reactive({
  key1: "Value 1",
});

interface Object1Interface {
  [key: string]: string;
  key1: string;
}

interface ConcatInterface {
  [key: string]: string;
  label: string;
  value: string;
}

const objectToConcat: ConcatInterface = reactive({
  label: "",
  value: "",
});

const upsertObjects2 = computed(() => {
  const returnObject = {
    ...object1,
    object2: { ...objectToConcat },
  };
  return returnObject;
});
</script>
