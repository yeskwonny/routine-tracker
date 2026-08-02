import { types, flow } from "mobx-state-tree";
import { client } from "../../apolloClient";
import { ADD_ITEM, DELETE_ITEM, GET_ITEMS, UPDATE_ITEM } from "../api/Item";

const Item = types.model("Item", {
  id: types.identifier,
  name: types.string,
  cycleDays: types.number,
  lastReplacedAt: types.string,
});

export const ItemStore = types
  .model("ItemStore", {
    items: types.array(Item),
    isLoading: types.optional(types.boolean, false),
  })
  .actions((self) => ({
    fetchItems: flow(function* () {
      self.isLoading = true;
      const { data } = yield client.query({ query: GET_ITEMS });
      self.items.replace(data.items);
      self.isLoading = false;
    }),

    addItem: flow(function* (input: {
      name: string;
      cycleDays: number;
      lastReplacedAt: string;
    }) {
      const { data } = yield client.mutate({
        mutation: ADD_ITEM,
        variables: input,
      });
      self.items.push(data.addItem);
    }),

    updateItem: flow(function* (input: {
      id: string;
      name: string;
      cycleDays: number;
      lastReplacedAt: string;
    }) {
      const { data } = yield client.mutate({
        mutation: UPDATE_ITEM,
        variables: input,
      });
      const index = self.items.findIndex((item) => item.id === input.id);
      if (index !== -1) {
        self.items[index] = data.updateItem;
      }
    }),

    removeItem: flow(function* (id: string) {
      const item = self.items.find((item) => item.id === id);
      if (!item) throw new Error(`No item with id ${id}`);
      yield client.mutate({ mutation: DELETE_ITEM, variables: { id } });
      self.items.remove(item);
    }),
  }));

export const itemStore = ItemStore.create({ items: [], isLoading: false });
