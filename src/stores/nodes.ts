import { defineStore } from "pinia";
import { nextTick, watch } from "vue";
import { Node } from "../models/Node";

export const useNodes = defineStore("nodes", {
  state: () => ({
    title: "Note List",
    curId: 1,
    nodes: [] as Node[],
    focusNodeId: undefined as number | undefined,
    searchWord: "",
  }),
  getters: {
    getNodeById({ nodes }) {
      return (id: number) => nodes.find((node) => node.id === id) as Node;
    },

    getChildrenOf({ nodes }) {
      return (node: Node | undefined) =>
        nodes.filter((n) => n.parent === node) as Node[];
    },

    rootNodes: function (): Node[] {
      return this.getChildrenOf(undefined);
    },

    filteredNodes({ nodes, searchWord }): Node[] {
      const nodesWithWord = nodes.filter((n) => n.content.includes(searchWord));

      const pathToTop = nodesWithWord.reduce((path, node) => {
        let n: Node = node;
        if (!path.includes(node)) path.push(node);

        while (n.parent !== undefined) {
          if (!path.includes(n.parent)) path.push(n.parent);
          n = n.parent;
        }
        return path;
      }, [] as Node[]);

      return this.nodes.filter((n) => pathToTop.includes(n));
    },

    filteredRootNodes: function (): Node[] {
      return this.filteredNodes.filter((n) => n.parent === undefined);
    },

    filteredChildrenOf: function () {
      return (node: Node) =>
        this.getChildrenOf(node).filter((n) => this.filteredNodes.includes(n));
    },
  },
  actions: {
    seed() {
      this.nodes.push(this.newNode("pipqwehroqwuehroiqh"));
      this.nodes.push(this.newNode("12312313"));
      this.nodes.push(this.newNode("ABCDEFG"));
      this.nodes.push(this.newNode("4444"));
      this.nodes.push(this.newNode("QWERTYUqwoeiuryoqi"));
      this.nodes.push(
        this.newNode(
          "qoperqprrqpupuqrupqruprqrqprrqpupuqruprqprrqpupuqrupqruprqrqprrqpupuqrupqruprqqruprqrquo"
        )
      );
      this.nodes.push(this.newNode("97977977997979777777"));

      this.getNodeById(2).parent = this.getNodeById(1);
      this.getNodeById(5).parent = this.getNodeById(3);
      this.getNodeById(6).parent = this.getNodeById(3);
      this.getNodeById(7).parent = this.getNodeById(5);
    },

    indent(node: Node) {
      const parent = node.parent;
      const siblings = parent === undefined ? this.rootNodes : parent.children;
      const index = siblings.findIndex((n) => n === node);

      if (index === 0) return;

      // sorting
      const newSiblings = siblings[index - 1].children;
      if (newSiblings.length > 0) {
        this.putNodeAfter(node, newSiblings[newSiblings.length - 1]);
      }

      node.parent = siblings[index - 1];

      this.refocus();
    },

    outdent(node: Node) {
      const parent = node.parent;

      if (parent === undefined) return;

      // sorting
      this.putNodeAfter(node, parent);

      node.parent = parent.parent;

      this.refocus();
    },

    indentFocused() {
      if (this.focusNodeId === undefined) return;
      this.indent(this.getNodeById(this.focusNodeId));
    },

    outdentFocused() {
      if (this.focusNodeId === undefined) return;
      this.outdent(this.getNodeById(this.focusNodeId));
    },

    newNode(content: string) {
      return new Node(this.curId++, content);
    },

    putNodeAfter(a: Node, b: Node) {
      const idxA = this.nodes.findIndex((n) => n === a);
      const idxB = this.nodes.findIndex((n) => n === b);

      if (idxA !== -1) {
        if (idxA > idxB) {
          this.nodes.splice(idxA, 1);
          this.nodes.splice(idxB + 1, 0, a);
        } else {
          this.nodes.splice(idxB + 1, 0, a);
          this.nodes.splice(idxA, 1);
        }
      } else {
        this.nodes.splice(idxB + 1, 0, a);
      }
    },

    addSibling(node: Node) {
      const sibling = this.newNode("");
      sibling.parent = node.parent;
      this.putNodeAfter(sibling, node);

      this.focusNodeId = sibling.id;
      this.refocus();
    },

    remove(node: Node) {
      const idx = this.nodes.findIndex((n) => n === node);
      this.nodes.splice(idx, 1);
    },

    async refocus() {
      await nextTick();

      const input = document.querySelector(
        `[data-id="${this.focusNodeId}"] p`
      ) as HTMLInputElement;

      console.debug(input);

      input.focus();
    },

    expandAll() {
      this.nodes.forEach((node) => {
        node.collapsed = false;
      });
    },

    collapseAll() {
      this.nodes.forEach((node) => {
        node.collapsed = true;
      });
    },

    init() {
      const savedNodeStore = JSON.parse(
        localStorage.getItem("nodeStore") ?? "{}"
      );

      Object.assign(this.$state, savedNodeStore);

      watch(
        this.$state,
        (state) => {
          localStorage.setItem("nodeStore", JSON.stringify(state));
        },
        { deep: true }
      );
    },
  },
});
