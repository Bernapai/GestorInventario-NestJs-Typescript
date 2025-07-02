import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import Categorys from 'src/categorys/entities/categorys.entity';
import Suppliers from 'src/suppliers/entities/suppliers.entity';
@Entity('products')
class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  stock: number;

  @ManyToOne(() => Categorys)
  category: Categorys;

  @ManyToOne(() => Suppliers)
  supplier: Suppliers;
}
export default Product;
