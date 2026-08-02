import "reflect-metadata";
import { DataSource } from "typeorm";
import { Item } from "./entities/Item";

export const AppDataSource = new DataSource({
  type: "better-sqlite3",
  database: "database.sqlite",
  synchronize: true,
  logging: true,
  entities: [Item],
});
