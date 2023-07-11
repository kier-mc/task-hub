<template>
  <div class="form-group">
    <template v-if="props.formData.type === 'input'">
      <FormInput
        :form-data="props.formData"
        :emit-label="emitData.label"
        @update:emit-label="(label) => (emitData.label = label)"
      />
    </template>
    <template v-else-if="props.formData.type === 'autocomplete'">
      <FormAutocomplete
        :form-data="props.formData"
        :emit-label="emitData.label"
        :emit-value="emitData.value"
        @update:emit-label="(label) => (emitData.label = label)"
        @update:emit-value="(value) => (emitData.value = value)"
      />
    </template>
  </div>
</template>

<style scoped lang="scss"></style>

<script setup lang="ts">
const props = defineProps({
  formData: {
    type: Object as PropType<FormHandlerData>,
    required: true,
  },
  emitLabel: {
    type: [String, null] as PropType<String | null>,
    required: true,
  },
  emitValue: {
    type: [String, null] as PropType<String | null>,
    required: false,
  },
});

// Emit definitions
const emit = defineEmits<{
  (event: "update:emit-label", data: string | null): void;
  (event: "update:emit-value", data: string | null): void;
}>();

// Emit handler
function handleEmit(): void {
  emit("update:emit-label", emitData.label);
  emit("update:emit-value", emitData.value);
}

// Reactive variables
const emitData: EmitData = reactive({
  label: null,
  value: null,
});

function populateDefaultValues() {
  if (!props.formData.default) return;
  emitData.label = props.formData.default;
  if (props.formData.options) {
    for (let i = 0; i < props.formData.options.length; i++) {
      const option = props.formData.options[i];
      if (!option.label || !option.value) continue;
      const { label, value } = option;
      if (emitData.label.toLocaleLowerCase() === label.toLocaleLowerCase()) {
        emitData.value = value;
        break;
      }
    }
  }
}

// Populate default values on mounted
onMounted(() => {
  populateDefaultValues();
  handleEmit();
});

// Emit changes automatically on update
onUpdated((): void => {
  handleEmit();
});
</script>
