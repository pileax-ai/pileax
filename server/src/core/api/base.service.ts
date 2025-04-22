import { NotFoundException } from '@/core/api/exceptions';
import type { Query } from "@/core/api/commonModel";

export class BaseService<T extends { id?: string }, R extends {
  findById(id: string): Promise<any>;
  create(data: T): Promise<any>;
  update(data: T): Promise<any>;
  delete(id: string): Promise<any>;
  getAll(userId: string): Promise<any>;
  query(data: Query): Promise<any>;
}> {
  protected repo: R;

  constructor(repository: R) {
    this.repo = repository;
  }

  async save(data: T) {
    const doc = data.id ? await this.repo.findById(data.id) : null;
    if (doc) {
      return this.update(data);
    } else {
      return this.create(data);
    }
  }

  async create(data: T) {
    return await this.repo.create(data);
  }

  async update(data: T) {
    return await this.repo.update(data);
  }

  async get(id: string) {
    const doc = await this.repo.findById(id);
    if (!doc) {
      throw new NotFoundException(this.constructor.name, id);
    }
    return doc;
  }

  async delete(id: string) {
    await this.repo.delete(id);
  }

  async getAll(userId: string) {
    return this.repo.getAll(userId);
  }

  async query(data: Query) {
    return this.repo.query(data);
  }
}
