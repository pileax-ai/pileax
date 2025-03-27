import {
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity as TypeORMBaseEntity
} from 'typeorm';

export abstract class BaseEntity extends TypeORMBaseEntity {

  @CreateDateColumn({ type: 'datetime' })
  createTime!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updateTime!: Date;

}
