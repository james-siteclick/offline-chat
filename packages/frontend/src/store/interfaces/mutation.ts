export type MutableRecord = {
  id: string;
  created_at: Date;
  deleted_at?: Date;
};

export type State<T extends MutableRecord> = Map<T["id"], T>;

export type CreateMutation<T extends MutableRecord> = {
  type: "CREATE";
  data: T;
};

export type DeleteMutation<T extends MutableRecord> = {
  type: "DELETE";
  data: T;
};

export type Mutation<T extends MutableRecord> =
  | CreateMutation<T>
  | DeleteMutation<T>;
