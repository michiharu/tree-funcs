import { getByPath, Tree, TreeOptions } from './tree';

type MapRootContext<I extends object = object> = {
  isRoot: true;
  path: number[];
  depth: 0;
  tree: I;
  children?: I[];
};

type MapNodeContext<I extends object = object> = {
  isRoot: false;
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

export type MapContext<I extends object> = MapRootContext<I> | MapNodeContext<I>;

type MapFunction<I extends object, R extends object> = (target: I, context: MapContext<I>, children?: R[]) => R;

type MapOptions<K extends string = string> = TreeOptions<K>;

const mapWithContext =
  <I extends object, R extends object>(mapArgs: [I, MapFunction<I, R>, Required<MapOptions>], path: number[]) =>
  (element: I, index?: number, arr?: I[]) => {
    const [tree, func, options] = mapArgs;
    const { childrenKey } = options;

    const isRoot = typeof index !== 'number';
    const children = element[childrenKey];
    const context: MapContext<I> = isRoot
      ? { isRoot, path: [], depth: 0, tree, children }
      : {
          isRoot: false,
          path: [...path, index],
          depth: path.length + 1,
          tree,
          children,
          index,
          parent: getByPath(tree, path, options),
          siblings: arr,
          prev: arr[index - 1],
          next: arr[index + 1],
        };
    const mapped = (element[childrenKey] as I[])?.map(mapWithContext(mapArgs, path));
    return { ...func(element, context, mapped), [childrenKey]: mapped };
  };

const defaultOptions: Required<MapOptions> = { childrenKey: 'children' };

export const map = <I extends Tree<K>, R extends Tree<K>, K extends string = 'children'>(
  tree: I,
  func: MapFunction<I, R>,
  options?: MapOptions<K>
): R => mapWithContext([tree, func, { ...defaultOptions, ...options }], [])(tree);

export const tree = { map };

export default tree;
