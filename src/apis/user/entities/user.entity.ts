import { UserArea } from '../../userArea/entities/userArea.entity';
import { UserTemp } from '../../userTemp/entities/userTemp.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  userNumber: string;

  @Column()
  //@Field(()=>String)
  password: string;

  @Column()
  @Field(() => String)
  name: string;

  @DeleteDateColumn()
  @Field(() => Date)
  withDeleted: Date;

  @ManyToOne(() => UserTemp)
  @Field(() => UserTemp)
  temperature: UserTemp;

  @JoinTable()
  @ManyToMany(() => UserArea, (areas) => areas.users)
  @Field(() => [UserArea])
  areas: UserArea[];
}
