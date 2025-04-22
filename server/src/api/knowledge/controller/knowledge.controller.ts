import { knowledgeService as service } from '@/api/knowledge/service/knowledge.service';
import { BaseController } from '@/core/api/base.controller'
import { Knowledge } from '@/api/knowledge/model/knowledge.model'

class KnowledgeController extends BaseController<Knowledge> {
  constructor() {
    super(service);
  }
}

export const knowledgeController = new KnowledgeController();
