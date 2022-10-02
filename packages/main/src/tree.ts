export type Tree<K extends string> = { [key in K]?: Tree<K>[] };

export type TreeOptions<K extends string = string> = { childrenKey?: K };

export const getByPath = <T extends object>(tree: T, path: number[], options: Required<TreeOptions>) => {
  if (path.length === 0) return tree;
  const { childrenKey } = options;
  const [index, ...next] = path;
  return getByPath(tree[childrenKey][index], next, options);
};
