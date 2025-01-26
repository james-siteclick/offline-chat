import { MutableRecord, Mutation, State } from "./interfaces/mutation";

export function reducer<T extends MutableRecord>(
  initialState: State<T>,
  mutations: Mutation<T>[]
): { appliedMutations: Mutation<T>[]; nextState: State<T> } {
  const nextState: State<T> = new Map(initialState);
  const appliedMutations: Mutation<T>[] = [];

  mutations.forEach((mutation) => {
    switch (mutation.type) {
      case "CREATE":
        if (!initialState.has(mutation.data.id)) {
          nextState.set(mutation.data.id, mutation.data);
          appliedMutations.push(mutation);
        } else {
          return logDroppedMutation(initialState, mutation);
        }
        break;

      case "DELETE":
        if (isDeletable(initialState, mutation)) {
          nextState.set(mutation.data.id, mutation.data);
          appliedMutations.push(mutation);
        } else {
          return logDroppedMutation(initialState, mutation);
        }
        break;
    }
  });

  return {
    appliedMutations,
    nextState,
  };
}

function isDeletable<T extends MutableRecord>(
  state: State<T>,
  mutation: Mutation<T>
) {
  return (
    state.has(mutation.data.id) && !state.get(mutation.data.id)?.deleted_at
  );
}

function logDroppedMutation<T extends MutableRecord>(
  state: State<T>,
  mutation: Mutation<T>
) {
  console.error(
    "Dropping mutation due to conflict",
    mutation,
    state.get(mutation.data.id)
  );
}
