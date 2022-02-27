<script setup lang="ts">
import { computed, ref } from "vue";
import { Node as NodeClass } from "../../models/Node";
import { useNodes } from "../../stores/nodes";

const props = defineProps<{ node: NodeClass }>();
const input = ref<HTMLInputElement | null>(null);

const nodes = useNodes();

const canCollapse = computed(() => props.node.children.length > 1);

function onBackspace() {
  if (!props.node.content.length) {
    nodes.remove(props.node);
  }
}
</script>

<template>
  <li class="list-none" :data-id="node.id">
    <span class="flex items-start">
      <button
        class="w-10 h-8 relative group grid place-items-center flex-shrink-0"
      >
        <span
          class=""
          :class="{ 'group-hover:opacity-0': canCollapse || node.collapsed }"
        >
          {{ node.collapsed ? "⦿" : "●" }}
        </span>
        <span
          class="absolute inset-0 opacity-0 group-hover:opacity-100"
          v-if="canCollapse || node.collapsed"
          @click="node.collapsed = !node.collapsed"
        >
          {{ node.collapsed ? "+" : "—" }}</span
        >
      </button>
      <div class="flex-grow relative">
        <span
          class="absolute opacity-50 py-1 pointer-events-none"
          v-if="!node.content"
        >
          Input here...
        </span>
        <p
          contenteditable
          type="text"
          class="bg-transparent focus:outline-none py-1 break-all w-full"
          ref="input"
          @focus="nodes.focusNodeId = node.id"
          @input="node.content = (input as HTMLInputElement).textContent ?? ''"
          @keydown.enter.prevent="nodes.addSibling(node)"
          @keydown.backspace="onBackspace"
        >
          {{ node.content }}
        </p>
      </div>
    </span>
    <ul
      class="ml-9 flex flex-col overflow-hidden"
      :class="{ 'h-0': node.collapsed }"
    >
      <Node v-for="n in node.children" :node="n" :key="n.id" />
    </ul>
  </li>
</template>
