import type { Knowledge } from '@/api/knowledge/model/knowledge.model';
import { KnowledgeRepository } from '@/api/knowledge/repo/knowledge.repository';
import { BaseService } from '@/core/api/base.service'

export class KnowledgeService extends BaseService<Knowledge, KnowledgeRepository>{

	constructor() {
		super(new KnowledgeRepository())
	}

}

export const knowledgeService = new KnowledgeService();
