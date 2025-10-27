import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
} from 'src/api/server/api'
import { RequestOptions } from 'core/types/request'
import { useApiStore } from 'stores/api'

export const GET = (options: RequestOptions) =>
  getRequest(options).then(res => res.data.data);

export const POST = (options: RequestOptions) =>
  postRequest(options).then(res => res.data.data);

export const PUT = (options: RequestOptions) =>
  putRequest(options).then(res => res.data.data);

export const DELETE = (options: RequestOptions) =>
  deleteRequest(options).then(res => res.data.data);

export default function() {
  const apiStore = useApiStore()

  return {}
}
