export function transformSlug(text: string): string {
    return text
        .replace(
            /[^a-zA-Z0-9\sàáâãäçèéêëìíîïòóôõöùúûüýÿÀÁÂÃÄÇÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÝŸ\s]/g,
            ' ',
        )
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .toLowerCase();
}
