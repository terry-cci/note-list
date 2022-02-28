<script setup lang="ts">
import { computed, h, nextTick, ref } from "vue";
import { Node as NodeClass } from "../../models/Node";
import { useNodes } from "../../stores/nodes";

import { marked } from "marked";
import { RouterLink, useRouter } from "vue-router";

const props = defineProps<{ node: NodeClass }>();
const input = ref<HTMLParagraphElement | null>(null);

const nodes = useNodes();

function onBackspace() {
  if (!props.node.content.length) {
    nodes.remove(props.node);
  }
}

function onEnter() {
  nodes.addSibling(props.node);
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

const editing = ref(false);

async function startEdit() {
  editing.value = true;

  await nextTick();
  (input.value as HTMLParagraphElement).focus();
}

const router = useRouter();

const contentWithMarkdown = computed(() =>
  marked
    .parseInline(props.node.content)
    .replaceAll(
      /\[\[(\d+)\]\]/g,
      `<a href="${router.resolve("/node-page/").href}$1">[[$1]]</a>`
    )
);
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
      <router-link :to="`/node-page/${node.id}`">
        <button
          class="w-10 h-8 relative grid place-items-center flex-shrink-0 opacity-0 group-hover:opacity-75 transition-opacity"
        >
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
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
        </button>
      </router-link>

      <button class="w-10 h-8 relative grid place-items-center flex-shrink-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 group-hover:opacity-0 transition-opacity"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            v-if="node.collapsed"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            v-else
          />
        </svg>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 absolute opacity-0 group-hover:opacity-100 transition-opacity"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          @click="node.collapsed = !node.collapsed"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
            v-if="node.collapsed"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M20 12H4"
            v-else
          />
        </svg>
      </button>
      <div class="flex-grow relative node-content" @click="startEdit">
        <span
          class="absolute opacity-50 py-1 pointer-events-none"
          v-if="!node.content"
        >
          Input here...
        </span>
        <p
          contenteditable
          class="py-1 break-all w-full focus:outline-none"
          ref="input"
          @focus="nodes.focusNodeId = node.id"
          @input="node.content = (input as HTMLParagraphElement).textContent ?? ''"
          @keydown.enter.prevent="onEnter"
          @keydown.backspace="onBackspace"
          @blur="editing = false"
          v-if="editing"
        >
          {{ node.content }}
        </p>
        <p
          class="py-1 break-all w-full"
          v-else
          v-html="contentWithMarkdown"
        ></p>
      </div>

      <span class="p-1 opacity-0 group-hover:opacity-50 ml-4">
        #{{ node.id }}
      </span>

      <button
        class="p-1 opacity-0 group-hover:opacity-100 group-hover:active:opacity-70 ml-4 grid place-items-center"
        @click="nodes.remove(node)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
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

<style>
.node-content {
  min-height: calc(1em + 0.5rem);
}
</style>
