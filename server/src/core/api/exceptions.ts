export class HttpException extends Error {
  constructor(
    public readonly status: number,
    public readonly message: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message)
    Object.setPrototypeOf(this, HttpException.prototype)
  }
}

export class NotFoundException extends HttpException {
  constructor(resource: string, id: string) {
    super(404, `${resource} with ID [${id}] not found`, {
      resource,
      id
    })
  }
}

export class ServerException extends HttpException {
  constructor(resource: string, message: string) {
    super(500, 'Internal Server Error.', {
      resource,
      message
    })
  }
}
