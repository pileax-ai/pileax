import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
} from 'src/api/server/api'
import { RequestOptions } from 'core/types/request'
import { useApiStore } from 'stores/api'
import { computed } from 'vue'

export const GET = (options: RequestOptions) => {
  return new Promise((resolve, reject) => {
    getRequest(options).then(res => {
      resolve(res.data.data)
    }).catch(error => {
      reject(error)
    })
  })
}

export const POST = (options: RequestOptions) => {
  return new Promise((resolve, reject) => {
    postRequest(options).then(res => {
      resolve(res.data.data)
    }).catch(error => {
      reject(error)
    })
  })
}

export const PUT = (options: RequestOptions) => {
  return new Promise((resolve, reject) => {
    putRequest(options).then(res => {
      resolve(res.data)
    }).catch(error => {
      reject(error)
    })
  })
}

export const DELETE = (options: RequestOptions) => {
  return new Promise((resolve, reject) => {
    deleteRequest(options).then(res => {
      resolve(res.data)
    }).catch(error => {
      reject(error)
    })
  })
}

export default function() {
  const apiStore = useApiStore()

  return {}
}
