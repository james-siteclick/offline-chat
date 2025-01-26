import { MutableRecord, Mutation, State } from "./interfaces/mutation";
import { reducer } from "./reducer";

export function makeStore<T extends MutableRecord>() {
  let _state: State<T> = new Map();
  let _mutationQueue: Mutation<T>[] = [];

  function getState() {
    return _state;
  }

  function setState(state: State<T>) {
    _state = state;
  }

  function getMutationQueue() {
    return _mutationQueue;
  }

  function setMutationQueue(mutationQueue: Mutation<T>[]) {
    _mutationQueue = mutationQueue;
  }

  function getViewState() {
    return reducer(_state, _mutationQueue).nextState;
  }

  function enqueueMutation(mutation: Mutation<T>) {
    _mutationQueue.push(mutation);
  }

  return {
    getState,
    setState,
    getMutationQueue,
    setMutationQueue,
    getViewState,
    enqueueMutation,
  };
}
