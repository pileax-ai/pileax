/**
 * Remote service
 *
 * @version 1.0
 */
import { GET, POST, PUT, DELETE } from 'src/hooks/useRequest';

export class RemoteProviderCredentialService {
  private apiName = 'providerCredential';

  save(body: Indexable): Promise<any> {
    return POST({ name: this.apiName, body });
  }

  put(body: Indexable): Promise<any> {
    return PUT({ name: this.apiName, body });
  }

  get(id: string): Promise<any> {
    return GET({ name: this.apiName, query: {id: id} });
  }

  delete(id: string) {
    return DELETE({ name: this.apiName, query: {id: id} });
  }

  query(body: Indexable): Promise<any> {
    return POST({ name: this.apiName, path: '/query', body });
  }

}

export const providerCredentialService = new RemoteProviderCredentialService();
