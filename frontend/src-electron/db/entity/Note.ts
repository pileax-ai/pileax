import {Entity, Column, PrimaryColumn} from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity({ name: 'note' })
export class Note extends BaseEntity {

  @PrimaryColumn({ unique: true, type: 'varchar', length: 64 })
  id!: string;

  @Column({ type: 'varchar', length: 64 })
  parent!: string;

  @Column({ type: 'varchar', length: 256 })
  title!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'varchar', length: 256, default: '' })
  icon!: string;

  @Column({ type: 'varchar', length: 256, default: '' })
  cover!: string;

}
