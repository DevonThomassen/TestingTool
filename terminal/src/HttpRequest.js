class HttpRequest {
  constructor(urlStr, onComplete, onError) {
    this.urlStr = urlStr;
    this.onComplete = onComplete;
    this.onError = onError;
  }
}

module.exports = HttpRequest;