class CMetrics {
  public url: string;
  public time: number;
  public results: number;
  public errors: number

  private constructor(url: string, time: number, results: number, errors: number) {
    this.url = url;
    this.time = time;
    this.results = results;
    this.errors = errors;
  }
}

export default CMetrics;
