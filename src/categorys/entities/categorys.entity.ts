import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('categorys')
class Categorys {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;
  products: any;
}
export default Categorys;
