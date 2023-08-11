<template>
  <div class="compass">
    <svg
      class="compass__background"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 50 50"
    >
      <path
        d="M25 49C11.766 49 1 38.233 1 25C1 11.766 11.766 1 25 1c13.233 0 24 10.766 24 24c0 13.233-10.767 24-24 24zm0-44C13.972 5 5 13.972 5 25s8.972 20 20 20s20-8.972 20-20S36.028 5 25 5zm.045 3.25S18 20.321 18 24v2c0 3.678 7.066 16 7.066 16S32 29.934 32 26.256v-2.262c0-3.679-6.955-15.744-6.955-15.744zM25 29a4 4 0 1 1 0-8a4 4 0 0 1 0 8z"
      />
    </svg>
    <div class="compass__letter compass__letter--n">N</div>
    <div class="compass__letter compass__letter--e">E</div>
    <div class="compass__letter compass__letter--s">S</div>
    <div class="compass__letter compass__letter--w">W</div>
    <div class="compass__needle"></div>
  </div>
</template>

<style scoped lang="scss">
.compass {
  overflow: hidden; // Hide overflow created by letter class negative margin
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto, 5);
  grid-template-rows: repeat(auto, 5);
  aspect-ratio: 1/1;
  min-width: 100%;
  &__background {
    position: absolute;
    inset: 0;
    max-width: 70%;
    margin: auto;
    fill: hsla(210, 45%, 75%, 0.25);
  }
  &__letter {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: -1rem; // Improve positioning of letters
    font-size: 0.75rem;
    font-weight: bold;
    user-select: none;
    &--n {
      grid-row: 1;
      grid-column: 3;
    }
    &--e {
      grid-row: 3;
      grid-column: 5;
    }
    &--s {
      grid-row: 5;
      grid-column: 3;
    }
    &--w {
      grid-row: 3;
      grid-column: 1;
    }
  }
  &__needle {
    position: absolute;
    inset: 0;
    width: 40%;
    height: 2px;
    margin: auto;
    transform: v-bind(setAngle);
    background-image: linear-gradient(
      90deg,
      hsla(0, 0%, 100%, 0) 25%,
      hsla(0, 0%, 100%, 1) 100%
    );
  }
}
</style>

<script setup lang="ts">
// Prop definitions
const props = defineProps({
  angle: {
    type: Number as PropType<number>,
    required: true,
  },
});

const setAngle = computed(() => {
  const angle = props.angle;
  return `rotateZ(${angle + 90}deg)`;
});
</script>
