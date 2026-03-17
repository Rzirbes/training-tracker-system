export function createFormData(data: Record<string, unknown>) {
    const formData = new FormData()

    for (const key in data) {
      const value = data[key as keyof typeof data]

      if (value === undefined || value === null || value === '' || (Array.isArray(value) && !value.length)) continue

      if (value instanceof File) {
        formData.append(key, value)
        continue
      }

      if (value instanceof FileList && value.length > 0) {
        formData.append(key, value[0])
        continue
      }

      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value))
        continue
      }

      if (value instanceof Date) {
        formData.append(key, value.toISOString())
        continue
      }

      if (value instanceof Object) {
        formData.append(key, JSON.stringify(value))
        continue
      }

      formData.append(key, String(value))
    }

    return formData
}