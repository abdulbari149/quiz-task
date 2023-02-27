class HttpException extends Error {
  public errorCodes?: Array<number>
  public statusCode: number
  constructor(message: string, statusCode: number, errorCodes?: number[]) {
    super(message)
    this.errorCodes = errorCodes;
    this.statusCode = statusCode;
  }
}

export default HttpException;