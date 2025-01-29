export type Mergeable = {
  id: string;
  created_at: Date;
  deleted_at?: Date;
};

export function getLastUpdatedAt(item: Mergeable): Date {
  const dates: Date[] = [item.created_at];
  if (item.deleted_at) {
    dates.push(item.deleted_at);
  }
  return new Date(Math.max(...dates.map((date) => date.getTime())));
}

export function merge<T extends Mergeable>(a: T[], b: T[]): T[] {
  const aMap = new Map(a.map((item) => [item.id, item]));
  const bMap = new Map(b.map((item) => [item.id, item]));
  const allKeys = new Set([
    ...a.map((item) => item.id),
    ...b.map((item) => item.id),
  ]);
  return [...allKeys]
    .map((id) => {
      const aItem = aMap.get(id);
      const bItem = bMap.get(id);

      if (aItem && bItem) {
        return getLastUpdatedAt(aItem) > getLastUpdatedAt(bItem)
          ? aItem
          : bItem;
      }
      return aItem ?? bItem;
    })
    .filter((item) => item !== undefined);
}
