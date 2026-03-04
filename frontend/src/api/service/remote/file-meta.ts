/**
 * Remote service
 *
 * @version 1.0
 */
import { BaseService } from 'src/api/service/remote/base'

export class FileMetaService extends BaseService {
  protected apiName = 'fileMeta'
}

export const fileMetaService = new FileMetaService()
