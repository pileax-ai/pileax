/**
 * Book Util
 *
 * @version 1.0
 */
export const getFileSHA1 =  async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-1', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return  hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const base64ToFile = (base64: string, name: string): File => {
  const arr = base64.split(',');
  if (arr.length < 2) throw new Error('Invalid base64 string');

  const mimeMatch = arr[0]?.match(/:(.*?);/);
  console.log('mimeMatch', mimeMatch)
  const mime = mimeMatch?.[1] ?? 'application/octet-stream';

  const extension = mime.split('/')[1] || 'png'; // image/png -> png
  const filename = `${name}.${extension}`;

  const bstr = atob(arr[1] || '');
  const u8arr = new Uint8Array(bstr.length);
  for (let i = 0; i < bstr.length; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }

  return new File([u8arr], filename, { type: mime });
}

export const getCoverUrl = (book: Indexable) => {
  return `${process.env.APP_BASE_URL}/files/book/${book.path}/${book.coverName}`;
}

export const getBookUrl = (book: Indexable) => {
  return `${process.env.APP_BASE_URL}/files/book/${book.path}/${book.fileName}`;
}

export const getBookUrlByPath = (filePath: string) => {
  return `${process.env.APP_BASE_URL}/files/book/${filePath}`;
}
