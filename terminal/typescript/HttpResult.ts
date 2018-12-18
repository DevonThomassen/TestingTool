class HttpResult {
  url: string;
  statusCode: number;
  milliseconds: number;
  body: string;
  mixedContent: boolean;

  constructor(url: string, statusCode: number, milliseconds: number, body: string) {
    this.url = url;
    this.statusCode = statusCode;
    this.milliseconds = milliseconds;
    this.body = body;
    this.mixedContent = null;
  }

  isSuccess() {
    return Math.floor(this.statusCode / 100) == 2;
  };

  checkMixedContent() {
    let regex = RegExp('<(?:link|img)[^<]*?(?:href|src)\s*=\s*[\'"]http:\/\/');
    if (this.body) {
      if (regex.test(this.body)) {
        this.mixedContent = true;
      } else {
        this.mixedContent = false;
      }
    } else {
      this.mixedContent = null;
    }
  }
}

export { HttpResult };