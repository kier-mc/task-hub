<template>
  <div class="input-group">
    <label class="input-group__label" :for="props.formData.formID">{{
      props.formData.labelText
    }}</label>
    <input
      class="input-group__input"
      :type="props.formData.attrType"
      :id="props.formData.formID"
      :name="props.formData.formID"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
    />
    <span v-if="props.formData.hintText" class="input-group__hint">{{
      props.formData.hintText
    }}</span>
  </div>
</template>

<style scoped lang="scss">
$input-padding: 0.5rem;
.input-group {
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
    padding: $input-padding;
    max-width: 25ch;
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
}
</style>

<script setup lang="ts">
const props = defineProps({
  formData: { type: Object as PropType<CompFormObject>, required: true },
});
</script>
