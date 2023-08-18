import type { Author_Collection } from "./Author";
import type { Literature_Collection } from "./Literature";

export type Collections =
  | typeof Author_Collection
  | typeof Literature_Collection;
