import { TreeNode } from "./types";

export function addLevel(treeData: TreeNode[], level = 1): TreeNode[] {
  const result: TreeNode[] = [];
  for (const node of treeData) {
    const newNode = { ...node, level };
    if (node.childNodes && node.childNodes.length) {
      newNode.childNodes = addLevel(node.childNodes, level + 1);
    }
    result.push(newNode);
  }
  return result;
}

export function childNodeIsExpanded(
  node: TreeNode,
  expandKeys: string[]
): boolean {
  if (expandKeys.length) {
    return expandKeys.includes(node.key);
  }
  return false;
}

export function flatTree(
  treeData: TreeNode[],
  expandKeys?: string[]
): TreeNode[] {
  let result: TreeNode[] = [];
  if (!Array.isArray(treeData)) {
    return result;
  }
  for (const node of treeData) {
    const newNode: TreeNode = { ...node, parentNode: null, childNodes: null };
    newNode.expanded =
      Array.isArray(expandKeys) && expandKeys.includes(newNode.key);
    result.push(newNode);
    if (
      node.childNodes &&
      node.childNodes.length &&
      childNodeIsExpanded(node, expandKeys || [])
    ) {
      result = result.concat(flatTree(node.childNodes, expandKeys));
    }
  }
  return result;
}

export function addNodeLeafParentProp(nodes: TreeNode[]): TreeNode[] {
  const result: TreeNode[] = [];
  for (const node of nodes) {
    const newNode: TreeNode = {
      ...node,
    };
    if (node.childNodes && node.childNodes.length) {
      newNode.childNodes = addNodeLeafParentProp(node.childNodes);
      newNode.childNodes.forEach((childNode) => {
        childNode.parentNode = newNode;
      });
    } else {
      newNode.isLeaf = true;
    }
    result.push(newNode);
  }
  return result;
}

function checkDown(nodes: TreeNode[]) {
  nodes.forEach((node) => {
    node.checked = true;
    if (Array.isArray(node.childNodes)) {
      checkDown(node.childNodes);
    }
  });
}
// FIXME 选中父节点再取消子节点bug
function checkUp(node: TreeNode) {
  if (!node) {
    return;
  }
  while (node) {
    const allChecked = node.childNodes?.every((child: TreeNode) => {
      return child.checked;
    });
    if (allChecked) {
      node.checked = true;
      node.indeterminate = false;
    } else {
      node.indeterminate = true;
    }
    if (!node.parentNode) {
      return;
    }
    node = node.parentNode;
  }
}

export function addNodeCheckedProp(
  nodes: TreeNode[],
  checkedKeys: string[],
  isStrict: boolean = false
): void {
  for (const node of nodes) {
    if (checkedKeys.includes(node.key)) {
      node.checked = true;
      if (!isStrict) {
        checkDown(node.childNodes || []);
        if (node.parentNode) {
          checkUp(node.parentNode);
        }
      }
    }
    if (node.childNodes && node.childNodes.length) {
      addNodeCheckedProp(node.childNodes, checkedKeys, isStrict);
    }
  }
}
