<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import { marked } from "marked";

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const heading = ref<HTMLHeadingElement | null>(null);
const editing = ref(false);

const withMarkdown = computed(() => marked.parseInline(props.modelValue));

async function startEdit() {
  editing.value = true;

  await nextTick();
  (heading.value as HTMLHeadingElement).focus();
}
</script>

<template>
  <h1
    contenteditable
    ref="heading"
    class="text-3xl font-bold focus:outline-none"
    @input="emit('update:modelValue', (heading as HTMLHeadingElement).textContent ?? '')"
    @blur="editing = false"
    v-if="editing"
  >
    {{ modelValue }}
  </h1>
  <h1
    v-else
    class="text-3xl font-bold focus:outline-none"
    v-html="withMarkdown"
    @click="startEdit"
  ></h1>
</template>
