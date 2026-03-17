import { Injectable } from '@nestjs/common';
import { IBucketRepository } from 'src/app/modules/buckets/repositories/bucket.repository';


interface IFileRepository {
    url: string;
}

@Injectable()
export class BucketInMemoryRepository implements IBucketRepository {
    private files: IFileRepository[] = [
        {
            url: 'https://bucket.com/path-test-e2e.pdf',
        },
    ];
    async copyFile(): Promise<void> {
        throw new Error('Method not implemented.');
    }

    async getFile(): Promise<Buffer> {
        throw new Error('Method not implemented.');
    }

    async putFile(): Promise<void> {
        throw new Error('Method not implemented.');
    }

    async listFiles(): Promise<string[]> {
        throw new Error('Method not implemented.');
    }

    async listFolders(): Promise<string[]> {
        throw new Error('Method not implemented.');
    }

    uploadFile(): Promise<void> {
        throw new Error('Method not implemented.');
    }

    async getSignedUrl(path: string): Promise<string> {
        return `https://bucket.com/${path}`;
    }

    async moveFile(): Promise<void> {
        throw new Error('Method not implemented.');
    }

    async verifyIfFileExists(path: string): Promise<boolean> {
        return this.files.some((f) => f.url.includes(path));
    }

    getStaticUrl(): string {
        return 'https://bucket.com';
    }

    async delete(path: string): Promise<void> {
        await new Promise((resolve) => setTimeout(() => resolve(path), 100));
    }
}
