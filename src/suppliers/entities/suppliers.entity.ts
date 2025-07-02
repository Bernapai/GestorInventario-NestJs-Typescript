import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity('suppliers')
class Suppliers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  phone: string;
}

export default Suppliers;
