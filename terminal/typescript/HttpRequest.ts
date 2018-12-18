class HttpRequest {
  urlStr: string;
  onComplete: Function;
  onError: Function;
  constructor(urlStr: string, onComplete: Function, onError: Function) {
    this.urlStr = urlStr;
    this.onComplete = onComplete;
    this.onError = onError;
  }
}

export { HttpRequest }
