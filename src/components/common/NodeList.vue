<script setup lang="ts">
import Node from "./Node.vue";
import { Node as NodeClass } from "../../models/Node";
import { useNodes } from "../../stores/nodes";

const props = defineProps<{
  nodes: NodeClass[];
  parent?: NodeClass;
}>();

const nodeStore = useNodes();

function newNode() {
  const node = nodeStore.newNode("");
  node.parent = props.parent;
  nodeStore.nodes.push(node);
}
</script>

<template>
  <ul class="mt-10">
    <Node v-for="node in nodes" :node="node" :key="node.id" />

    <h2 v-if="nodes.length === 0" class="text-center">
      Nothing here...

      <button
        class="border px-4 py-1 rounded ml-3 active:bg-gray-800"
        @click="newNode"
      >
        Add one
      </button>
    </h2>
  </ul>
</template>
