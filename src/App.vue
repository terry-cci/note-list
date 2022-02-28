<script setup lang="ts">
import { useNodes } from "./stores/nodes";
import ToolBar from "./components/common/ToolBar.vue";

const nodes = useNodes();
nodes.init();
</script>

<template>
  <div class="w-1/2 flex flex-col py-20 mx-auto flex-grow">
    <ToolBar />

    <router-view />
  </div>

  <footer class="w-full px-10 bg-black py-5 flex justify-between">
    <span>
      GitHub Repository:
      <a
        href="https://github.com/terry-cci/note-list"
        target="_blank"
        class="underline"
        >terry-cci/note-list</a
      >
    </span>

    <span>2022 &copy; Terry C.C.I. </span>
  </footer>
</template>
