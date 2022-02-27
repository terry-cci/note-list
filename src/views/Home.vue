<script setup lang="ts">
import { useNodes } from "../stores/nodes";
import Node from "../components/common/Node.vue";
import { ref } from "vue";

const titleInput = ref<HTMLHeadingElement | null>(null);
const nodes = useNodes();
</script>

<template>
  <div
    @keydown.tab.exact.prevent="nodes.indentFocused"
    @keydown.tab.shift.prevent="nodes.outdentFocused"
    class="w-1/2 flex flex-col py-20"
  >
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
    <h1
      contenteditable
      ref="titleInput"
      class="text-3xl font-bold focus:outline-none"
      @input="nodes.title = (titleInput as HTMLHeadingElement).textContent ?? ''"
    >
      {{ nodes.title }}
    </h1>
    <ul class="mt-20">
      <Node
        v-for="node in nodes.searchWord
          ? nodes.filteredRootNodes
          : nodes.rootNodes"
        :node="node"
        :key="node.id"
        v-if="
          (nodes.searchWord ? nodes.filteredRootNodes : nodes.rootNodes)
            .length > 0
        "
      />
      <h2 v-else class="text-center">
        Nothing here...
        <button
          class="border px-4 py-1 rounded ml-3 active:bg-gray-800"
          @click="nodes.nodes.push(nodes.newNode(''))"
          v-if="!nodes.searchWord"
        >
          Add one
        </button>
      </h2>
    </ul>
  </div>
</template>
