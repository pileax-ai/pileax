/**
 * Remote service
 *
 * @version 1.0
 */
import { GET, POST, DELETE } from 'src/hooks/useRequest'

export class RemoteLLMProviderService {
  private apiName = 'llmProvider'

  async save(data: Indexable): Promise<any> {
    return POST({ name: this.apiName, body: data })
  }


  async get(id: string): Promise<any> {
    return GET({ name: this.apiName, query: {id: id} })
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

  async getProviders() {
    return GET({ name: this.apiName, path: '/providers' })
  }

  async updateProviders() {
    return POST({ name: this.apiName, path: '/update' })
  }

}

export const llmProviderService = new RemoteLLMProviderService()
