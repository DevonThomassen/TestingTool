class HttpRequest {
  urlStr: string;
  onComplete: string;
  onError: string;
  constructor(urlStr, onComplete, onError) {
    this.urlStr = urlStr;
    this.onComplete = onComplete;
    this.onError = onError;
  }
}

export { HttpRequest }