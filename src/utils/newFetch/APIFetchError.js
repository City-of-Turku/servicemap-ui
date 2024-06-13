class APIFetchError extends Error {
  constructor(props) {
    super(props);
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, APIFetchError);
    }

    this.name = 'APIFetchError';
    // Custom debugging information
    this.date = new Date();
  }
}

export default APIFetchError;
