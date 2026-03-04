/**
 * Remote file service
 *
 * @version 1.0
 */
import { GET, POST } from 'src/hooks/useRequest'

export class FileService {
  protected apiName = 'file'

  upload(file: File, meta: Indexable): Promise<any> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('meta', JSON.stringify(meta))
    return POST({
      name: this.apiName,
      path: '/upload',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
  }

}

export const fileService = new FileService()
