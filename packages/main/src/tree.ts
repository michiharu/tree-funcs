export type TreeOptions<K extends string = string> = { childrenKey?: K };

export const getByPath = <I extends { [key in K]?: I[] }, K extends string>(
  tree: I,
  path: number[],
  options: Required<TreeOptions<K>>
): I => {
  if (path.length === 0) return tree;
  const { childrenKey } = options;
  const [index, ...next] = path;
  return getByPath(tree[childrenKey][index], next, options);
};

type TreeRootContext<I extends object> = {
  isRoot: true;
  node?: undefined;
  root: {
    path: number[];
    depth: 0;
    tree: I;
    children?: I[];
  };
};

type TreeNodeContext<I extends object> = {
  isRoot: false;
  root?: undefined;
  node: {
    path: number[];
    depth: number;
    tree: I;
    children?: I[];
    index: number;
    parent: I;
    siblings: I[];
    prev?: I;
    next?: I;
  };
};

export type TreeContext<I extends object> = TreeRootContext<I> | TreeNodeContext<I>;

export const contextFactory = <I extends object, K extends string>(
  options: Required<TreeOptions<K>>,
  path: number[],
  tree: I,
  children?: I[],
  index?: number,
  siblings?: I[]
): TreeContext<I> => {
  const isRoot = typeof index !== 'number';
  if (isRoot) return { isRoot: true, root: { path: [], depth: 0, tree, children } };
  return {
    isRoot: false,
    node: {
      path: [...path, index],
      depth: path.length + 1,
      tree,
      children,
      index,
      parent: getByPath(tree, path, options),
      siblings,
      prev: siblings[index - 1],
      next: siblings[index + 1],
    },
  };
};
