class CResult {
  public num: number;
  public url: string;
  public statusCode: number;
  public milliseconds: number;
  public mixedContent: boolean;

  private constructor(
    num: number,
    url: string,
    statusCode: number,
    milliseconds: number,
    mixedContent: boolean) {

    this.num = num;
    this.url = url;
    this.statusCode = statusCode;
    this.milliseconds = milliseconds;
    this.mixedContent = mixedContent;
  }
}

export default CResult;
