// class AppError extends Error {
//   constructor(messaage, statusCode) {
//     super(messaage);
//     this.statusCode = statusCode;
//     this.status = String(statusCode).startsWith("4") ? 'fail' : 'error';
//     this.isOperation = true;
//     Error.captureStackTrace(this , this.constructor)
//   }
// }

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = String(statusCode).startsWith('4') ? 'fail' : 'error';
    this.isOperation = true;
    Error.captureStackTrace(this , this.constructor)
  }
}

module.exports = AppError;
