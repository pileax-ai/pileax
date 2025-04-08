import type { FileMeta } from '@/api/file/model/file.model';
import { FileMetaRepository } from '@/api/file/repo/file.repository';
import { BaseService } from '@/core/api/base.service'

export class FileMetaService extends BaseService<FileMeta, FileMetaRepository>{

	constructor() {
		super(new FileMetaRepository())
	}

}

export const fileMetaService = new FileMetaService();
