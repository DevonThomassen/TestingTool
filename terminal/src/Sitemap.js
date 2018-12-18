const Document = require('./Document'),
  Image = require('./Image');

class Sitemap {
  constructor(documents) {
    this.documents = documents;
  }

  static fromData(data) {
    if (!data || !data.urlset || !data.urlset.url) {
      return false;
    }

    let urls = data.urlset.url.map((url) => {
      let images = url['image:image'] 
        ? url['image:image'].map((image) => {
          return new Image(image['image:loc'][0]);
        })
        : [];
      return new Document(url.loc[0], images);
    });

    return new Sitemap(urls);
  }
}

module.exports = Sitemap;