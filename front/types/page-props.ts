export interface IPageProps {
  params: Record<string, string>
  searchParams: { [key: string]: string | string[] | undefined }
}
