import { contextFactory, TreeContext, TreeOptions } from './tree';

export type MapFunction<I extends { [key in K]?: I[] }, R, K extends string> = (
  target: I,
  context: TreeContext<I>,
  children: R[]
) => R;

type MapOptions<K extends string = string> = TreeOptions<K>;

export type TreeMapWithContext = <I extends { [key in K]?: I[] }, R, K extends string = 'children'>(
  mapArgs: [I, MapFunction<I, R, K>, Required<MapOptions<K>>],
  path: number[]
) => (element: I, index?: number, siblings?: I[]) => R;

const mapWithContext: TreeMapWithContext = (mapArgs, path) => (element, index, siblings) => {
  const [tree, func, options] = mapArgs;
  const { childrenKey } = options;
  const children = element[childrenKey];
  const context = contextFactory(options, path, tree, children, index, siblings);
  const mapped = children?.map(mapWithContext(mapArgs, path));
  return { ...func(element, context, mapped), [childrenKey]: mapped };
};

const defaultOptions: Required<MapOptions> = { childrenKey: 'children' };

export type TreeMap = <I extends { [key in K]?: I[] }, R, K extends string = 'children'>(
  tree: I,
  func: MapFunction<I, R, K>,
  options?: MapOptions<K>
) => R;

export const map: TreeMap = (tree, func, options) =>
  mapWithContext([tree, func, { ...defaultOptions, ...options }], [])(tree);

export const tree = { map };

export default tree;
