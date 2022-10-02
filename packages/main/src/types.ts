export type Merge<T extends object> = { [K in keyof T]: T[K] };
