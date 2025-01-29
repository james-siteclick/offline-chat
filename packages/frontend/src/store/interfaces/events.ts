import { Store } from "../store";
import { MutableRecord, Mutation } from "./mutation";

export enum StoreEventType {
  enqueueMutation = "enqueueMutation",
  init = "init",
  stateChange = "stateChange",
}

export type EnqueueMutationEvent<T extends MutableRecord> = {
  type: StoreEventType.enqueueMutation;
  store: Store<T>;
  mutation: Mutation<T>;
};

export type InitEvent<T extends MutableRecord> = {
  type: StoreEventType.init;
  store: Store<T>;
};

export type StateChangeEvent<T extends MutableRecord> = {
  type: StoreEventType.stateChange;
  store: Store<T>;
};

export type StoreEvent<T extends MutableRecord> =
  | EnqueueMutationEvent<T>
  | InitEvent<T>
  | StateChangeEvent<T>;

export type StoreSubscriber<T extends MutableRecord> = (
  event: StoreEvent<T>
) => void;
