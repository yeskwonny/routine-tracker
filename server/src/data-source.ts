import "reflect-metadata";
import { DataSource } from "typeorm";
import { Item } from "./entities/Item.js";

const isProduction = !!process.env.DATABASE_URL;

export const AppDataSource = new DataSource(
  isProduction
    ? {
        type: "postgres",
        url: process.env.DATABASE_URL,
        synchronize: true,
        logging: true,
        entities: [Item],
        ssl: { rejectUnauthorized: false },
      }
    : {
        type: "better-sqlite3",
        database: "database.sqlite",
        synchronize: true,
        logging: true,
        entities: [Item],
      },
);
