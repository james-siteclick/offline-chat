import {
  StoreEvent,
  StoreEventType,
  StoreSubscriber,
} from "./interfaces/events";
import { MutableRecord, Mutation, State } from "./interfaces/mutation";
import { reducer } from "./reducer";

type MakeStoreParams<T extends MutableRecord> = {
  subscribers?: StoreSubscriber<T>[];
};

export class Store<T extends MutableRecord> implements Store<T> {
  protected state: State<T> = new Map();
  protected viewState: State<T> = new Map();
  protected mutationQueue: Mutation<T>[] = [];
  protected subscribers: StoreSubscriber<T>[];

  constructor(readonly params?: MakeStoreParams<T>) {
    this.subscribers = params?.subscribers ?? [];
    this.publishEvent({
      type: StoreEventType.init,
      store: this,
    });
  }

  public getState() {
    return this.state;
  }

  public setState(state: State<T>) {
    this.state = state;
    this.viewState = reducer(this.state, this.mutationQueue).nextState;
    this.publishEvent({
      type: StoreEventType.stateChange,
      store: this,
    });
  }

  public getMutationQueue() {
    return this.mutationQueue;
  }

  public setMutationQueue(queue: Mutation<T>[]) {
    this.mutationQueue = queue;
    this.viewState = reducer(this.state, this.mutationQueue).nextState;
  }

  public getViewState() {
    return this.viewState;
  }

  public enqueueMutation(mutation: Mutation<T>) {
    this.mutationQueue.push(mutation);
    this.viewState = reducer(this.state, this.mutationQueue).nextState;
    this.publishEvent({
      type: StoreEventType.enqueueMutation,
      store: this,
      mutation,
    });
  }

  public deleteMutation(mutation: Mutation<T>) {
    this.mutationQueue = this.mutationQueue.filter((item) => item !== mutation);
    this.viewState = reducer(this.state, this.mutationQueue).nextState;
    this.publishEvent({
      type: StoreEventType.stateChange,
      store: this,
    });
  }

  private publishEvent(event: StoreEvent<T>) {
    this.subscribers.map((subscriber) => subscriber(event));
  }

  public subscribe(callback: StoreSubscriber<T>) {
    this.subscribers.push(callback);

    // Unsubscribe
    return () => this.unsubscribe;
  }

  public unsubscribe(callback: StoreSubscriber<T>) {
    this.subscribers = this.subscribers.filter(
      (subscriber) => subscriber !== callback
    );
  }

  public isSubscribed(callback: StoreSubscriber<T>) {
    return this.subscribers.includes(callback);
  }
}
