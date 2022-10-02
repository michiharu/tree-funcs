import { map } from './map';

type TreeTest = {
  id: string;
  children?: TreeTest[] | null;
};

test('basic', () => {
  const data: TreeTest = {
    id: 'a',
    children: [
      { id: 'b', children: [] },
      { id: 'c', children: [{ id: 'd', children: [] }] },
    ],
  };
  const result = map(data, (t) => ({ ...t, prop: 'test' }));
  expect(result).toEqual({
    id: 'a',
    prop: 'test',
    children: [
      { id: 'b', prop: 'test', children: [] },
      { id: 'c', prop: 'test', children: [{ id: 'd', prop: 'test', children: [] }] },
    ],
  });
});

test('no children', () => {
  const data: TreeTest = {
    id: 'a',
    children: [{ id: 'b' }, { id: 'c', children: [{ id: 'd', children: [] }] }],
  };
  const result = map(data, (t) => ({ ...t, prop: 'test' }));
  expect(result).toEqual({
    id: 'a',
    prop: 'test',
    children: [
      { id: 'b', prop: 'test' },
      { id: 'c', prop: 'test', children: [{ id: 'd', prop: 'test', children: [] }] },
    ],
  });
});

test('set childrenKey', () => {
  const data = {
    id: 'a',
    childNodes: [{ id: 'b' }, { id: 'c', childNodes: [{ id: 'd', childNodes: [] }] }],
  };
  const result = map(data, (t) => ({ ...t, prop: 'test' }), { childrenKey: 'childNodes' });
  expect(result).toEqual({
    id: 'a',
    prop: 'test',
    childNodes: [
      { id: 'b', prop: 'test' },
      { id: 'c', prop: 'test', childNodes: [{ id: 'd', prop: 'test', childNodes: [] }] },
    ],
  });
});
