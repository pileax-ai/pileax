/**
 * Remote service
 *
 * @version 1.0
 */
import { GET, POST, DELETE } from 'src/hooks/useRequest'

export class RemoteKnowledgeService {
  private apiName = 'knowledge'

  async save(data: Indexable): Promise<any> {
    return POST({ name: this.apiName, body: data })
  }

  async get(id: string): Promise<any> {
    return GET({ name: this.apiName, query: {id: id} })
  }

  async getAll(query: Indexable): Promise<any> {
    return GET({ name: this.apiName, path: '/all', query: query })
  }

  async delete(id: string) {
    return DELETE({ name: this.apiName, query: {id: id} })
  }

  /**
   * Pagination query
   *
   * @param query
   */
  async query(query: Indexable): Promise<any> {
    return POST({ name: this.apiName, path: '/query', body: query })
  }

}

export const knowledgeService = new RemoteKnowledgeService()
