import { NotFoundException } from '@/core/api/exceptions';
import type { FileMeta } from '@/api/file/model/file.model';
import type { Query } from "@/core/api/commonModel";
import { FileMetaRepository } from '@/api/file/repo/file.repository';

export class FileMetaService {
	private repo: FileMetaRepository;

	constructor(repository: FileMetaRepository = new FileMetaRepository()) {
		this.repo = repository;
	}

  async create(data: FileMeta) {
    return await this.repo.create(data);
  }

  async update(data: FileMeta) {
    return await this.repo.update(data);
  }

	async get(id: string) {
		const doc = await this.repo.findById(id);
    if (!doc) {
      throw new NotFoundException('FileMeta', id.toString());
    }
    return doc;
	}

  async delete(id: string) {
    await this.repo.delete(id);
  }

  async query(data: Query) {
    return this.repo.query(data)
  }
}

export const fileMetaService = new FileMetaService();
