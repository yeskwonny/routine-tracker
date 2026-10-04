import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./data-source.js";
import { Item } from "./entities/Item.js";
import { Subscription } from "./entities/Subscription.js";
import { typeDefs } from "./schemas/typeDefs.js";

const itemRepository = AppDataSource.getRepository(Item);
const subscriptionRepository = AppDataSource.getRepository(Subscription);

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
    saveSubscription: async (
      _parent: unknown,
      args: { endpoint: string; p256dh: string; auth: string },
    ) => {
      await subscriptionRepository.clear();
      const sub = subscriptionRepository.create(args);
      await subscriptionRepository.save(sub);
      return true;
    },
  },
};

AppDataSource.initialize()
  .then(async () => {
    console.log("✅ Suceesfully connetct to DB");

    const app = express();
    const server = new ApolloServer({ typeDefs, resolvers: resolvers as any });

    await server.start();

    app.use(
      "/",
      cors({
        origin: [
          "http://localhost:5173",
          "https://routine-tracker-olive-one.vercel.app",
        ],
        credentials: true,
      }),
      express.json(),
      expressMiddleware(server),
    );

    const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Fail to connect to DB ", err);
  });
