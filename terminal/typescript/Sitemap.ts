import { Doc } from './Document';
import { Img } from './Image';

class Sitemap {
  documents: Array<Doc>;
  constructor(documents: Array<Doc>) {
    this.documents = documents;
  }

  static fromData(data) {
    if (!data || !data.urlset || !data.urlset.url) {
      return false;
    }

    let urls = data.urlset.url.map((url) => {
      let images = url['image:image']
        ? url['image:image'].map((image) => {
          return new Img(image['image:loc'][0]);
        })
        : [];
      return new Doc(url.loc[0], images);
    });

    return new Sitemap(urls);
  }
}

export { Sitemap };