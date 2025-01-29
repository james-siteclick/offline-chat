import { MutableRecord, Mutation, State } from "./mutation";

export interface Store<T extends MutableRecord> {
  getState: () => State<T>;
  setState: (state: State<T>) => void;
  getMutationQueue: () => Mutation<T>[];
  setMutationQueue: (queue: Mutation<T>[]) => void;
  getViewState: () => State<T>;
  enqueueMutation: (mutation: Mutation<T>) => void;
}
