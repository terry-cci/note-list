<script setup lang="ts">
import { useNodes } from "../stores/nodes";
import EditableHeading from "../components/common/EditableHeading.vue";
import NodeList from "../components/common/NodeList.vue";
import { computed } from "vue";

const nodes = useNodes();

const displayRootNodes = computed(() =>
  nodes.searchWord ? nodes.filteredRootNodes : nodes.rootNodes
);
</script>

<template>
  <EditableHeading v-model="nodes.title" />

  <NodeList :nodes="displayRootNodes" :parent="undefined" />
</template>
