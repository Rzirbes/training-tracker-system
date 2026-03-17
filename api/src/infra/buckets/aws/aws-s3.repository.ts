import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { IBucketRepository } from 'src/app/modules/buckets/repositories/bucket.repository';


@Injectable()
export class IAwsS3Repository implements IBucketRepository {
  private clientS3: S3;
  private bucketName = this.config.get('AWS_S3_BUCKET_NAME');
  private bucketStaticUrl = this.config.get('AWS_S3_BUCKET_STATIC_URL');

  constructor(private readonly config: ConfigService) {
    this.clientS3 = new S3({
      region: this.config.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.config.get('AWS_ACCESS_KEY_ID') || '',
        secretAccessKey: this.config.get('AWS_SECRET_ACCESS_KEY') || '',
      },
    });
  }

  getStaticUrl(path?: string): string {
    const encodedPath = path ? encodeURIComponent(path) : '';
    return new URL(String(this.bucketStaticUrl).concat(encodedPath)).toString();
  }

  public async copyFile(
    sourcePath: string,
    destinationPath: string,
  ): Promise<void> {
    try {
      await this.clientS3
        .copyObject({
          Bucket: this.bucketName,
          Key: destinationPath,
          CopySource: `${this.bucketName}/${sourcePath}`,
        })
        .promise();
    } catch (error) {
      throw new Error('Error to copy file!');
    }
  }

  public async getFile(filePath: string): Promise<Buffer> {
    try {
      const response = await this.clientS3
        .getObject({
          Bucket: this.bucketName,
          Key: filePath,
        })
        .promise();
      return response.Body as Buffer;
    } catch (error) {
      throw new Error('Error to get file!');
    }
  }

  public async putFile(
    filePath: string,
    body: Buffer | ArrayBuffer | string,
    fileType?: string,
  ): Promise<void> {
    try {
      await this.clientS3
        .putObject({
          Bucket: this.bucketName,
          Key: filePath,
          Body: body,
          ...(fileType && { ContentType: fileType }),
        })
        .promise();
    } catch (error) {
      throw new Error('Error saving file!');
    }
  }

  public async listFiles(filePath: string): Promise<string[]> {
    try {
      let allFiles: any[] = [];
      let isTruncated = true;
      let continuationToken: string | undefined = undefined;

      while (isTruncated) {
        const response = await this.clientS3
          .listObjectsV2({
            Bucket: this.bucketName,
            Prefix: filePath,
            ContinuationToken: continuationToken,
          })
          .promise();

        const files = response?.Contents?.map(({ Key }) => Key) ?? [];
        allFiles = allFiles.concat(files);

        isTruncated = response.IsTruncated ?? false;
        continuationToken = response.NextContinuationToken;
      }
      return allFiles.filter(Boolean) as string[];
    } catch (error) {
      throw new Error('Error listing folders!');
    }
  }

  public async listFolders(filePath: string): Promise<string[]> {
    try {
      const Prefix = filePath.concat('/');
      const response = await this.clientS3
        .listObjectsV2({
          Bucket: this.bucketName,
          Prefix,
          Delimiter: '/',
        })
        .promise();
      const folders =
        response?.CommonPrefixes?.map(({ Prefix }) => Prefix) ?? [];
      if (folders.includes(undefined)) return [];
      return folders as string[];
    } catch (error) {
      throw new Error('Error listing folders!');
    }
  }

  public async getSignedUrl(path: string): Promise<string> {
    try {
      const oneDayInSeconds = 86400;
      const action = 'getObject';
      const url = await this.clientS3.getSignedUrlPromise(action, {
        Bucket: this.bucketName,
        Key: path,
        Expires: oneDayInSeconds,
      });

      return url;
    } catch (error) {
      throw new Error('Error retrieving file url!');
    }
  }

  async moveFile(sourcePath: string, destinationPath: string): Promise<void> {
    try {
      await this.clientS3
        .copyObject({
          Bucket: this.bucketName,
          CopySource: `${this.bucketName}/${sourcePath}`,
          Key: destinationPath,
        })
        .promise();

      await this.clientS3
        .deleteObject({
          Bucket: this.bucketName,
          Key: sourcePath,
        })
        .promise();
    } catch (error) {
      throw new Error('Fail moving files!');
    }
  }

  async delete(path: string): Promise<void> {
    const params = {
      Bucket: this.bucketName,
      Key: path,
    };

    await this.clientS3
      .deleteObject(params, (error) => {
        if (error) console.error('Error deleting bucket aws s3 file', error);
      })
      .promise();
  }

  async verifyIfFileExists(path: string): Promise<boolean> {
    try {
      await this.clientS3
        .headObject({
          Bucket: this.bucketName,
          Key: path,
        })
        .promise();

      return true;
    } catch (error) {
      return false;
    }
  }

  async uploadFile(file: Express.Multer.File, filePath: string): Promise<void> {
    const params: AWS.S3.PutObjectRequest = {
      Bucket: this.bucketName,
      Key: filePath,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    await this.clientS3.putObject(params).promise();
  }
}
