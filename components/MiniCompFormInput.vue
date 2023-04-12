<template>
  <div class="input-group">
    <label for="email">{{ props.formData.labelText }}</label>
    <input :type="props.formData.attrType" id="email" name="email" />
    <span class="hint">{{ props.formData.hintText }}</span>
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
}
label,
span.hint {
  margin-left: calc($input-padding / 2);
}
label {
  margin-bottom: 0.5rem;
  // font-size: 1.125rem;
  letter-spacing: 0.05rem;
}
input {
  all: unset;
  padding: $input-padding;
  max-width: 25ch;
  margin-bottom: 0.5rem;
  background-color: hsl(0, 0%, 15%);
}
span.hint {
  font-size: 0.75rem;
  opacity: 0.5;
}
</style>

<script setup lang="ts">
const props = defineProps({
  formData: { type: Object as PropType<CompFormObject>, required: true },
});
</script>
