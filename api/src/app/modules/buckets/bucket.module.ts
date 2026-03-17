import { Module } from '@nestjs/common';
import { IAwsS3Repository } from 'src/infra/buckets/aws/aws-s3.repository';

@Module({
    providers: [
        {
            provide: 'IBucketRepository',
            useClass: IAwsS3Repository,
        },
    ],
    exports: ['IBucketRepository'],
})
export class BucketModule {}
