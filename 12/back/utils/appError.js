class AppError extends Error {
  constructor(status, message) {
    // Join multiple errors in one string
    const msg = Array.isArray(message) ? message.join(' && ') : message;

    super(msg);
    this.status = status;
  }
}

module.exports = AppError;
