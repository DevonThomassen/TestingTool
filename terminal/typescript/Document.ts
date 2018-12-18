import { Img } from './Image';

class Doc {
  url: string;
  images: Img[];
  constructor(url: string, images: Img[]) {
    this.url = url;
    this.images = images;
  }
}

export { Doc };