<script setup lang="ts">
import { useNodes } from "../../stores/nodes";

const nodes = useNodes();
</script>

<template>
  <div class="self-end mb-6 flex items-center gap-x-2">
    <button
      class="flex-shrink-0 border rounded px-4 py-1 active:bg-gray-800"
      @click="nodes.expandAll()"
    >
      Expand All
    </button>
    <button
      class="flex-shrink-0 border rounded px-4 py-1 active:bg-gray-800"
      @click="nodes.collapseAll()"
    >
      Collapse All
    </button>
    <input
      type="text"
      placeholder="Search..."
      class="bg-transparent focus:outline-none border-b w-full"
      v-model="nodes.searchWord"
    />
  </div>
</template>
