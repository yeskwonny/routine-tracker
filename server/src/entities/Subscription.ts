import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  endpoint!: string;

  @Column({ type: "varchar" })
  p256dh!: string;

  @Column({ type: "varchar" })
  auth!: string;
}
