<template>
  <div class="form-group">
    <label class="form-group__label" :for="props.formData.formID">{{
      props.formData.labelText
    }}</label>
    <!-- If element is input -->
    <template v-if="props.formData.elementType === 'input'">
      <input
        class="form-group__input"
        :type="props.formData.attrType"
        :id="props.formData.formID"
        :name="props.formData.formID"
        @input="emitEvent($event)"
      />
      <span v-if="props.formData.hintText" class="form-group__hint">{{
        props.formData.hintText
      }}</span>
    </template>
    <!-- If element is select -->
    <template v-else-if="props.formData.elementType === 'select'">
      <select
        class="form-group__select"
        @input="emitEvent($event)"
        v-model="props.formData.default"
      >
        <option
          v-for="option in props.formData.options"
          class="form-group__option"
          :value="option.value"
        >
          {{ option.text }}
        </option>
      </select>
    </template>
  </div>
</template>

<style scoped lang="scss">
$input-padding: 0.5rem;
.form-group {
  position: relative;
  display: flex;
  flex-direction: column;
  &:not(:last-child) {
    margin-bottom: 2rem;
  }
  &__label {
    margin-bottom: 0.5rem;
    letter-spacing: 0.05rem;
  }
  &__input {
    all: unset;
    max-width: 25ch;
    padding: $input-padding;
    margin-bottom: 0.5rem;
    background-color: hsl(0, 0%, 15%);
    cursor: text;
  }
  &__hint {
    font-size: 0.75rem;
    opacity: 0.5;
  }
  &__label,
  &__hint {
    margin-left: calc($input-padding / 2);
  }
  &__select {
    max-width: 25ch;
    padding: 0.5rem 0.5rem 0.5rem 0.35rem;
    border: 1px solid hsl(0, 0%, 30%);
    font-size: 1rem;
  }
}
</style>

<script setup lang="ts">
const props = defineProps({
  formData: { type: Object as PropType<CompFormObject>, required: true },
});

const emit = defineEmits<{
  (event: "update:model-value", value: string): void;
  (event: "input", value: string): void;
}>();

function emitEvent(event: Event) {
  const target = event.target as HTMLInputElement | HTMLSelectElement;
  const value = target.value;
  emit("update:model-value", value);
  emit("input", value);
}
</script>
