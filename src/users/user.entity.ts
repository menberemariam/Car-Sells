import {
  AfterInsert,
  Entity,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Reports } from '../reports/reports.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  @Column()
  password: string;

  @Column({ default: true })
  admin: boolean;

  @OneToMany(() => Reports, (reports) => reports.user)
  reports: Reports[];
  @AfterInsert()
  logInsert() {
    console.log('User inserted:', this.id);
  }
}
