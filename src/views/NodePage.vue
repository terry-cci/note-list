<script setup lang="ts">
import { useNodes } from "../stores/nodes";

import { computed } from "vue";
import EditableHeading from "../components/common/EditableHeading.vue";
import NodeList from "../components/common/NodeList.vue";
import { useRoute } from "vue-router";

const nodes = useNodes();

const route = useRoute();
const node = computed(() =>
  nodes.getNodeById(parseInt(route.params.id as string))
);
</script>

<template>
  <div class="flex items-center">
    <router-link
      class="mr-5"
      :to="node.parent ? `/node-page/${node.parentId}` : '/'"
    >
      <button>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11 17l-5-5m0 0l5-5m-5 5h12"
          />
        </svg>
      </button>
    </router-link>
    <EditableHeading v-model="node.content" />
  </div>

  <NodeList :nodes="node.children" :parent="node" />
</template>
