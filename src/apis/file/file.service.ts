import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { ImageService } from '../image/image.service';

@Injectable()
export class FileService {
  constructor(private readonly imageService: ImageService) {}
  async upload({ files }) {
    const imgList = await Promise.all(files);

    const storage = new Storage({
      projectId: 'aerial-yeti-353603',
      keyFilename: 'gcp-key-file.json',
    }).bucket('test-account-04');

    const urls = await Promise.all(
      imgList.map((element) => {
        return new Promise((resolve, reject) => {
          element
            .createReadStream()
            .pipe(storage.file(element.filename).createWriteStream())
            .on('finish', () => resolve(`test-account-04/${element.filename}`))
            .on('error', () =>
              reject('Error 404: 이미지 업로드에 실패하였습니다.'),
            );
        });
      }),
    );

    await Promise.all(
      urls.map((element) => {
        return this.imageService.create({ src: element });
      }),
    );

    return urls;
  }
}
