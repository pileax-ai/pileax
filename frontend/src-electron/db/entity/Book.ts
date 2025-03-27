import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity({ name: 'book' })
export class Book extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ unique: true, type: 'varchar', length: 64 })
  uuid!: string;

  @Column({ type: 'varchar', length: 256 })
  title!: string;

  @Column({ type: 'varchar', length: 256 })
  path!: string;

  @Column({ name: 'file_name', type: 'varchar', length: 256 })
  fileName!: string;

  @Column({ type: 'varchar', length: 32, nullable: true })
  extension!: string;

  @Column({ name: 'cover_name', type: 'varchar', length: 256, nullable: true })
  coverName!: string;

  @Column({ type: 'integer', default: 0 })
  rating!: number;

  @Column({ type: 'varchar', length: 256, nullable: true })
  author!: string;

  @Column({ type: 'varchar', length: 32, nullable: true })
  language!: string;

  @Column({ type: 'text', length: 32, nullable: true })
  description!: string;

  @Column({ type: 'varchar', length: 256, nullable: true })
  publisher!: string;

  @Column({ type: 'varchar', length: 32, nullable: true })
  published!: string;

  @Column({ name: 'reading_position', type: 'varchar', length: 32, nullable: true })
  readingPosition!: string;

  @Column({ name: 'reading_percentage', type: 'real', default: 0.0, nullable: true })
  readingPercentage!: number;
}
