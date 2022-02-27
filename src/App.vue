<script setup lang="ts">
import { useNodes } from "./stores/nodes";

const nodes = useNodes();
nodes.init();
</script>

<template>
  <div class="w-full grid place-items-center">
    <router-view />
  </div>
</template>
