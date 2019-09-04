import * as AWS from 'aws-sdk';
import * as sharp from 'sharp';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

interface IVariant {
  name: string;
  width: number;
  height?: number;
}

export class FileS3 {
  public static async url(filePath: string, variant?: string) {
    const params = {
      Bucket: 'safeway-store',
      Key: filePath,
    };

    if (variant) {
      const array = params.Key.split('/');
      array.splice(-1, 0, variant);
      params.Key = array.join('/');
    }

    return s3.getSignedUrl('getObject', params);
  }

  public static get(filePath: string) {
    const params = {
      Bucket: 'safeway-store',
      Key: filePath,
    };

    return s3.getObject(params).promise();
  }

  public static async upload(
    image: any,
    options: { path: string; id: string; variants?: IVariant[] }
  ) {
    const { filename, mimetype, createReadStream } = await image;
    const stream = createReadStream();

    let envFolder = 'dev';
    if (process.env.ENV === 'production') {
      envFolder = 'prod';
    }

    const uuid = Math.random()
      .toString(36)
      .substring(2);

    const params = {
      Bucket: 'safeway-store',
      Body: stream,
      Key: `${envFolder}/${options.path}/${options.id}/${uuid}_${filename}`,
      ContentType: mimetype,
    };

    return s3
      .upload(params)
      .promise()
      .then(data => {
        if (options.variants) {
          options.variants.map(async variant => {
            const { Body }: any = await this.get(data.Key).catch(err => {
              console.log(err);
            });

            const resizedImage = await sharp(Body)
              .resize(variant.height, variant.width)
              .toBuffer();

            const variantOption = {
              Bucket: 'safeway-store',
              Body: resizedImage,
              Key: `${envFolder}/${options.path}/${options.id}/${variant.name}/${uuid}_${filename}`,
              ContentType: mimetype,
            };

            await s3.upload(variantOption).promise();
          });
        }

        return data.Key;
      })
      .catch(err => err);
  }

  public static async remove(filePath: string, variants?: IVariant[]) {
    const params = {
      Bucket: 'safeway-store',
      Key: filePath,
    };

    if (variants) {
      variants.map(async v => {
        const newParams = { ...params };

        const array = filePath.split('/');
        array.splice(-1, 0, v.name);
        newParams.Key = array.join('/');

        await s3.deleteObject(newParams).promise();
      });
    }

    return s3
      .deleteObject(params)
      .promise()
      .catch(err => err);
  }
}
