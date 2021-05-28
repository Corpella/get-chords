<template>
  <div id="Header">
    <div class="mt-10 pb-10">
      <el-menu class="el-menu-demo" mode="horizontal" router>
        <div class="flex justify-center">
          <el-menu-item index="/recordings">
            <i class="el-icon-service"></i>
            <template #title> Recording Mode </template>
          </el-menu-item>
          <el-menu-item index="/live">
            <i class="el-icon-microphone"></i>
            <template #title> Live Mode </template></el-menu-item
          >
        </div>
      </el-menu>
    </div>
    <div class="navbar">
      wewe
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

type Colors = 'red'|'green'

export default defineComponent({
  name: 'Navbar',
  props: {},
  components: {},
  setup: () => {
    const navbarColor = ref<Colors>('green')
    return { navbarColor }
  },
})
</script>

<style lang="scss">
.navbar {
  background-color: v-bind(navbarColor);
}
</style>
