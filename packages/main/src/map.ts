import { Merge } from './types';

type MapContext<I extends object> = {
  index?: number;
  depth: number;
  path: number[];
  tree: I;
  parent?: I;
  siblings?: I[];
  prev?: I;
  next?: I;
  children?: I[];
};

type MapFunction<I extends object, O extends object> = (target: I, context: MapContext<I>, children?: O[]) => O;

type MapOptions = Partial<{
  /** The default `childrenProp` value is `children` */
  childrenProp: string;
}>;

type MapWithContextArgument<I extends object, O extends object> = Merge<
  { func: MapFunction<I, O>; options: MapOptions } & Pick<MapContext<I>, 'tree' | 'parent' | 'path'>
>;

const mapWithContext =
  <I extends object, O extends object>({ func, options, tree, parent, path }: MapWithContextArgument<I, O>) =>
  (element: I, index: number, arr: I[]) => {
    const { childrenProp = 'children' } = options;
    const children = element[childrenProp];
    const context: MapContext<I> = {
      index,
      path: [...path, index],
      depth: path.length + 1,
      tree,
      parent,
      siblings: arr,
      prev: arr[index - 1],
      next: arr[index + 1],
      children,
    };

    return func(
      element,
      context,
      children.map(mapWithContext({ func, options, tree, parent: element, path: context.path }))
    );
  };

export const map = <I extends object, O extends object>(tree: I, func: MapFunction<I, O>, options: MapOptions): O => {
  const path = [];
  const { childrenProp = 'children' } = options;
  const children = tree[childrenProp];
  const context: MapContext<I> = {
    path,
    depth: path.length,
    tree,
    children,
  };
  return func(tree, context, children.map(mapWithContext({ func, options, tree, parent: tree, path })));
};

export const tree = { map };

export default tree;
