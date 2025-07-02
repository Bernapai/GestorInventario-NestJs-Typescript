import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import User from 'src/users/entities/users.entity';
import Product from 'src/products/entities/products.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Product)
  product: Product;

  @Column()
  quantity: number;

  @Column('decimal')
  totalPrice: number;

  @Column()
  date: Date;
}
export default Transaction;
