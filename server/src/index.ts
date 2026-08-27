import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { AppDataSource } from "./data-source.js";
import { Item } from "./entities/Item.js";
import { typeDefs } from "./schemas/typeDefs.js";

const itemRepository = AppDataSource.getRepository(Item);

const resolvers = {
  Query: {
    items: () => itemRepository.find(),
  },
  Mutation: {
    addItem: async (
      _parent: unknown,
      args: { name: string; cycleDays: number; lastReplacedAt: string },
    ) => {
      const newItem = itemRepository.create(args);
      return itemRepository.save(newItem);
    },
    updateItem: async (
      _parent: unknown,
      args: {
        id: string;
        name?: string;
        cycleDays?: number;
        lastReplacedAt?: string;
      },
    ) => {
      const existingItem = await itemRepository.findOneBy({ id: args.id });
      if (!existingItem)
        throw new Error(`Can't find a item with id ${args.id} `);

      itemRepository.merge(existingItem, args);
      return itemRepository.save(existingItem);
    },
    deleteItem: async (_parent: unknown, args: { id: string }) => {
      const existingItem = await itemRepository.findOneBy({ id: args.id });
      if (!existingItem)
        throw new Error(`Can't find a item with id ${args.id} `);

      await itemRepository.remove(existingItem);
      return existingItem;
    },
  },
};

AppDataSource.initialize()
  .then(async () => {
    console.log("✅ Suceesfully connetct to DB");

    const server = new ApolloServer({ typeDefs, resolvers: resolvers as any });
    const { url } = await startStandaloneServer(server, {
      listen: { port: 4000 },
    });

    console.log(`🚀 Server is running: ${url}`);
  })
  .catch((err) => {
    console.error("❌ Fail to connect to DB ", err);
  });
