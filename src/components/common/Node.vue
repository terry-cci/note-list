<script setup lang="ts">
import { computed, ref } from "vue";
import { Node as NodeClass } from "../../models/Node";
import { useNodes } from "../../stores/nodes";

const props = defineProps<{ node: NodeClass }>();
const input = ref<HTMLInputElement | null>(null);

const nodes = useNodes();

function onBackspace() {
  if (!props.node.content.length) {
    nodes.remove(props.node);
  }
}

function onDragStart(e: DragEvent) {
  if (e.dataTransfer) {
    e.dataTransfer.setData("text/plain", props.node.id.toString());
    e.dataTransfer.effectAllowed = "move";
  }
}

function onDragOver(e: DragEvent) {
  nodes.dropOverNodeId = props.node.id;
}

function onDrop(e: DragEvent) {
  if (e.dataTransfer) {
    const nodeId = parseInt(e.dataTransfer.getData("text/plain"));
    const node = nodes.getNodeById(nodeId);

    if (node !== props.node && !node.isAncestorOf(props.node)) {
      node.parent = props.node.parent;
      nodes.putNodeAfter(node, props.node);
    }

    nodes.dropOverNodeId = undefined;
  }
}
</script>

<template>
  <li
    class="list-none"
    :data-id="node.id"
    draggable="true"
    @dragstart.stop="onDragStart"
    @dragover.stop.prevent="onDragOver"
    @drop.stop.prevent="onDrop"
  >
    <span class="flex items-start group">
      <button
        class="w-10 h-8 relative group grid place-items-center flex-shrink-0"
      >
        <span class="group-hover:opacity-0">
          {{ node.collapsed ? "⦿" : "●" }}
        </span>
        <span
          class="absolute inset-0 opacity-0 group-hover:opacity-100"
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

      <span class="p-1 opacity-0 group-hover:opacity-50 ml-4">
        #{{ node.id }}
      </span>

      <button
        class="p-1 opacity-0 group-hover:opacity-100 group-hover:active:opacity-70 ml-4"
        @click="nodes.remove(node)"
      >
        X
      </button>
    </span>
    <ul
      class="ml-9 flex flex-col overflow-hidden"
      :class="{ 'h-0': node.collapsed }"
    >
      <Node v-for="n in node.children" :node="n" :key="n.id" />
    </ul>
  </li>
  <div
    class="w-full bg-gray-50 h-0.5"
    v-if="nodes.dropOverNodeId === node.id"
  ></div>
</template>
