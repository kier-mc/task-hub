<template>
  <div class="container-panel">
    <table class="data">
      <tr class="data__row">
        <td class="data__label">{{ props.data.set_1.label }}</td>
        <td class="data__value">{{ props.data.set_1.value }}</td>
      </tr>
      <tr class="data__row">
        <td class="data__label">{{ props.data.set_2.label }}</td>
        <td class="data__value">{{ props.data.set_2.value }}</td>
      </tr>
      <tr class="data__row">
        <td class="data__label">{{ props.data.set_3.label }}</td>
        <td class="data__value">{{ props.data.set_3.value }}</td>
      </tr>
    </table>
  </div>
</template>

<style scoped lang="scss">
@use "../assets/scss/data/colour";
@use "../assets/scss/data/fontsize";
.container-panel {
  display: flex;
  align-items: center;
  justify-content: center;
}
.data {
  width: 100%;
  table-layout: fixed;
  user-select: none;
  &__label {
    width: 55%;
    height: 1rem;
    border-right: 1px solid colour.$hub-data-border;
    vertical-align: middle;
  }
  &__value {
    height: 1rem;
    padding-left: 0.5rem;
    font-size: fontsize.$xl;
    vertical-align: middle;
    text-rendering: optimizeLegibility;
    font-variant: tabular-nums;
    letter-spacing: -0.1rem;
  }
}
</style>

<script setup lang="ts">
// Type defintions
import type { WeatherPanelData } from "types/components/weather";

// Prop defintions
const props = defineProps({
  data: {
    type: Object as PropType<WeatherPanelData>,
    required: true,
  },
});
</script>
