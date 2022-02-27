import { useNodes } from "../stores/nodes";

export class Node {
  id: number;
  parentId?: number;
  depth: number = 0;
  content: string;
  collapsed: boolean = false;

  constructor(id: number, content = "") {
    this.id = id;
    this.content = content;
  }

  public get parent(): Node | undefined {
    if (this.parentId === undefined) return undefined;

    const nodes = useNodes();
    return nodes.getNodeById(this.parentId);
  }

  public set parent(node: Node | undefined) {
    if (node === undefined) {
      this.parentId = undefined;
      this.depth = 0;
    } else {
      this.parentId = node.id;
      this.depth = node.depth + 1;
    }
  }

  public get children(): Node[] {
    const nodes = useNodes();

    if (nodes.searchWord !== "") {
      return nodes.filteredChildrenOf(this);
    } else {
      return nodes.getChildrenOf(this);
    }
  }
}
