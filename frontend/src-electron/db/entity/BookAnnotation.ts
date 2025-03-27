import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity({ name: 'book_annotation' })
export class BookAnnotation extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ name: 'book_id', type: 'integer' })
  bookId!: string;

  @Column({ type: 'varchar', length: 32 })
  type!: string;

  @Column({ type: 'varchar', length: 256 })
  value!: string;

  @Column({ type: 'text' })
  note!: string;

  @Column({ type: 'varchar', length: 32 })
  color!: string;

  @Column({ type: 'integer', default: 0 })
  page!: number;

  @Column({ type: 'varchar', length: 256, default: '' })
  chapter!: string;
}
