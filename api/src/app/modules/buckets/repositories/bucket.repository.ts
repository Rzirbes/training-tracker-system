export interface IBucketRepository {

    getStaticUrl(path?: string): string;

    delete(path: string): Promise<void>;

    verifyIfFileExists(path: string): Promise<boolean>;

    moveFile(sourcePath: string, destinationPath: string): Promise<void>;

    getSignedUrl(path: string): Promise<string>;

    uploadFile(file: Express.Multer.File, filePath: string): Promise<void>;

    listFolders(filePath: string): Promise<string[]>;

    listFiles(filePath: string): Promise<string[]>;

    getFile(filePath: string): Promise<Buffer>;

    putFile(
        filePath: string,
        body: Buffer | ArrayBuffer | string,
        fileType?: string,
    ): Promise<void>;

    copyFile(sourcePath: string, destinationPath: string): Promise<void>;
}
