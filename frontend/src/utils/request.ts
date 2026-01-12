import axios from 'axios'

export const getErrorMessage = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message || err.message
  } else if (err instanceof Error) {
    return err.message
  } else {
    return String(err)
  }
}
