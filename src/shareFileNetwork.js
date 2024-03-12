import { apps } from './shared/js/apps';
import HTTP from './shared/react/HTTP';

export async function getUploadUrl(fileName, mimeType) {
  try {
    const { url, shortId, file } = await HTTP.publicPost(apps.Encrypt37Share.name, `/v1/upload-url`, {
      fileName,
      mimeType,
    });

    return { data: { url, shortId, file }, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function uploadFile(url, encryptedFileBlob) {
  try {
    await fetch(url, {
      method: 'PUT',
      body: encryptedFileBlob,
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    });

    return { data: { success: true }, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function fetchFile(fileId) {
  try {
    const data = await HTTP.publicGet(apps.Encrypt37Share.name, `/v1/files/${fileId}`);

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
