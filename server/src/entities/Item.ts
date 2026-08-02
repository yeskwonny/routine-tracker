import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Item {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  name!: string;

  @Column({ type: "int" })
  cycleDays!: number;

  @Column({ type: "varchar" })
  lastReplacedAt!: string;
}
