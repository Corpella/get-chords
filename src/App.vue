<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Home from './pages/Home.vue'

export default defineComponent({
  name: 'App',
  components: {
    Home,
  },
})
</script>

<style lang="scss">
$blue-light: #49f1d5;
$blue: #2e748f;
$blue-dark: #153a49;

$white: #ffffff;
$black: #000000;

.content-center {
  display: grid;
  place-items: center;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

* {
  box-sizing: border-box;
}

html {
  width: 100%;
  height: 100%;

  background: linear-gradient(180deg, $blue, $blue-dark);

  font-size: 10px;
}

.waveform {
  position: relative;

  padding: 4rem 0;

  &__canvas {
    width: 100%;
    height: 40rem;
  }
}


.button {
  transition: background 0.4s ease-in-out, color 0.4s ease-in-out;

  position: relative;

  display: inline-block;

  width: 8rem;
  height: 8rem;

  background: $white;

  border-radius: 50%;
  border: none;
  outline: none;

  color: rgba($black, 0.5);
  font-size: 4rem;

  cursor: pointer;

  &--record {
    &::before {
      animation: spin 4s linear infinite;
      transition: opacity 0.4s ease-in-out;

      content: '';

      position: absolute;
      top: 0;
      left: 0;

      width: 7.8rem;
      height: 7.8rem;
      margin: 0.1rem;

      background: transparent;
      opacity: 0;

      border-radius: 50%;
      border: 0.4rem solid rgba($blue, 0.8);
      border-top-color: rgba($blue, 0);
    }

    &.button--active {
      background: #ed6a5f;

      color: $white;

      &::before {
        opacity: 1;
      }
    }
  }

  &--play {
    width: 5rem;
    height: 5rem;

    font-size: 2rem;

    vertical-align: inherit;

    &.button--active {
      background: $blue-light;

      color: $white;
    }
  }

  &--disabled {
    opacity: 0.2;

    cursor: not-allowed;
  }
}

.audio {
  width: 0;
  height: 0;

  opacity: 0;
  visibility: 0;
}
</style>
