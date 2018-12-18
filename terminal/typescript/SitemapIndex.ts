class SitemapIndex {
    urls: string[];
    constructor(urls: string[]) {
      this.urls = urls
    }
  
    static fromData(data) {
      if (!data || !data.sitemapindex || !data.sitemapindex.sitemap) {
        return false;
      }
  
      let urls = data.sitemapindex.sitemap.map((sitemap) => {
        return sitemap.loc[0];
      });
  
      return new SitemapIndex(urls);
    }
  }
  
  export { SitemapIndex };