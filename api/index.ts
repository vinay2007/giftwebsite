import express, { Request, Response } from 'express';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { put, del, list } from '@vercel/blob';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

dotenv.config();

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

function isBlobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN && process.env.BLOB_READ_WRITE_TOKEN.trim().length > 0);
}

app.get('/api/status', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    blobConfigured: isBlobConfigured(),
    message: isBlobConfigured()
      ? 'Vercel Blob is configured and ready.'
      : 'Vercel Blob is not configured. Set BLOB_READ_WRITE_TOKEN in Vercel environment variables.',
  });
});

app.post('/api/blob/upload', async (req: Request, res: Response): Promise<void> => {
  if (!isBlobConfigured()) {
    res.status(503).json({
      error: 'BLOB_NOT_CONFIGURED',
      message: 'Vercel Blob storage is not configured. Please add BLOB_READ_WRITE_TOKEN.',
    });
    return;
  }

  try {
    const jsonResponse = await handleUpload({
      body: req.body as HandleUploadBody,
      request: req,
      onBeforeGenerateToken: async (pathname: string) => {
        if (!pathname.startsWith('gifts/')) {
          throw new Error('Invalid destination path. Must be inside gifts/.');
        }

        return {
          allowedContentTypes: [
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif',
            'image/heic',
            'image/heif',
            'audio/mpeg',
            'audio/mp3',
            'audio/wav',
            'audio/aac',
            'audio/ogg',
            'audio/webm',
            'audio/mp4',
            'audio/m4a',
            'audio/x-m4a',
          ],
          maximumSizeInBytes: 60 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log('[Vercel Blob] Upload completed:', blob.url);
      },
    });

    res.json(jsonResponse);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message || 'Failed to process blob upload' });
  }
});

app.post('/api/gifts/publish', async (req: Request, res: Response): Promise<void> => {
  if (!isBlobConfigured()) {
    res.status(503).json({
      error: 'BLOB_NOT_CONFIGURED',
      message: 'Vercel Blob storage is not configured. Please connect a Vercel Blob store and set BLOB_READ_WRITE_TOKEN.',
    });
    return;
  }

  const { gift } = req.body;
  if (!gift || typeof gift !== 'object') {
    res.status(400).json({ error: 'Missing or invalid gift payload.' });
    return;
  }

  try {
    const publicId = 'gft_' + crypto.randomBytes(8).toString('hex');
    const recoveryKey = 'rec_' + crypto.randomBytes(16).toString('hex');
    const recoveryKeyHash = crypto.createHash('sha256').update(recoveryKey).digest('hex');

    const mediaUrls: string[] = [];
    if (Array.isArray(gift.photos)) {
      gift.photos.forEach((p: { src?: string }) => {
        if (p?.src && p.src.includes('vercel-storage.com')) {
          mediaUrls.push(p.src);
        }
      });
    }
    if (gift.audio?.songSrc && gift.audio.songSrc.includes('vercel-storage.com')) {
      mediaUrls.push(gift.audio.songSrc);
    }
    if (gift.audio?.voiceSrc && gift.audio.voiceSrc.includes('vercel-storage.com')) {
      mediaUrls.push(gift.audio.voiceSrc);
    }

    const publishedAt = Date.now();

    const publicGift = {
      ...gift,
      id: publicId,
      isPublished: true,
      publishedAt,
      updatedAt: publishedAt,
    };

    const metaRecord = {
      publicId,
      recoveryKeyHash,
      themeStyleLocked: gift.theme?.themeStyle || 'midnight',
      publishedAt,
      updatedAt: publishedAt,
      mediaUrls,
    };

    const giftBlob = await put(`gifts/${publicId}/gift.json`, JSON.stringify(publicGift), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
    });

    await put(`gifts/${publicId}/meta.json`, JSON.stringify(metaRecord), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
    });

    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    const host = req.headers['x-forwarded-host'] || req.get('host');
    const baseUrl = process.env.APP_URL || `${protocol}://${host}`;
    const publicUrl = `${baseUrl}/gift/${publicId}`;

    res.json({
      success: true,
      publicId,
      publicUrl,
      recoveryKey,
      giftUrl: giftBlob.url,
      publishedAt,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message || 'Failed to publish gift.' });
  }
});

app.get('/api/gifts/:id', async (req: Request, res: Response): Promise<void> => {
  if (!isBlobConfigured()) {
    res.status(503).json({ error: 'BLOB_NOT_CONFIGURED' });
    return;
  }

  const { id } = req.params;
  const prefix = `gifts/${id}/gift.json`;

  try {
    const { blobs } = await list({ prefix, limit: 1 });
    const targetBlob = blobs.find((b) => b.pathname === prefix);

    if (!targetBlob) {
      res.status(404).json({ error: 'Gift not found or has been removed.' });
      return;
    }

    const response = await fetch(targetBlob.url);
    if (!response.ok) {
      res.status(404).json({ error: 'Could not fetch gift data.' });
      return;
    }

    const gift = await response.json();
    res.json({ success: true, gift });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message || 'Failed to load gift.' });
  }
});

app.put('/api/gifts/:id/manage', async (req: Request, res: Response): Promise<void> => {
  if (!isBlobConfigured()) {
    res.status(503).json({ error: 'BLOB_NOT_CONFIGURED' });
    return;
  }

  const { id } = req.params;
  const recoveryKey = req.headers['x-recovery-key'] as string;
  const { gift } = req.body;

  if (!recoveryKey) {
    res.status(401).json({ error: 'Missing management recovery key.' });
    return;
  }

  try {
    const metaPrefix = `gifts/${id}/meta.json`;
    const { blobs: metaBlobs } = await list({ prefix: metaPrefix, limit: 1 });
    const metaBlob = metaBlobs.find((b) => b.pathname === metaPrefix);

    if (!metaBlob) {
      res.status(404).json({ error: 'Gift record not found.' });
      return;
    }

    const metaRes = await fetch(metaBlob.url);
    const metaData = await metaRes.json();

    const inputHash = crypto.createHash('sha256').update(recoveryKey).digest('hex');
    if (inputHash !== metaData.recoveryKeyHash) {
      res.status(403).json({ error: 'Invalid recovery key.' });
      return;
    }

    const requestedTheme = gift.theme?.themeStyle || 'midnight';
    if (metaData.themeStyleLocked && requestedTheme !== metaData.themeStyleLocked) {
      res.status(400).json({
        error: 'THEME_LOCKED',
        message: `The theme of a published gift is locked to "${metaData.themeStyleLocked}". To use a different theme, create a new gift.`,
      });
      return;
    }

    const updatedPublicGift = {
      ...gift,
      id,
      isPublished: true,
      updatedAt: Date.now(),
    };

    await put(`gifts/${id}/gift.json`, JSON.stringify(updatedPublicGift), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
    });

    res.json({ success: true, message: 'Gift updated successfully.', gift: updatedPublicGift });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message || 'Failed to update gift.' });
  }
});

app.delete('/api/gifts/:id/manage', async (req: Request, res: Response): Promise<void> => {
  if (!isBlobConfigured()) {
    res.status(503).json({ error: 'BLOB_NOT_CONFIGURED' });
    return;
  }

  const { id } = req.params;
  const recoveryKey = req.headers['x-recovery-key'] as string;

  if (!recoveryKey) {
    res.status(401).json({ error: 'Missing management recovery key.' });
    return;
  }

  try {
    const metaPrefix = `gifts/${id}/meta.json`;
    const { blobs: metaBlobs } = await list({ prefix: metaPrefix, limit: 1 });
    const metaBlob = metaBlobs.find((b) => b.pathname === metaPrefix);

    if (!metaBlob) {
      res.status(404).json({ error: 'Gift record not found.' });
      return;
    }

    const metaRes = await fetch(metaBlob.url);
    const metaData = await metaRes.json();

    const inputHash = crypto.createHash('sha256').update(recoveryKey).digest('hex');
    if (inputHash !== metaData.recoveryKeyHash) {
      res.status(403).json({ error: 'Invalid recovery key.' });
      return;
    }

    const { blobs: allBlobs } = await list({ prefix: `gifts/${id}/` });
    const urlsToDelete = allBlobs.map((b) => b.url);

    if (urlsToDelete.length > 0) {
      await del(urlsToDelete);
    }

    res.json({ success: true, message: 'Published gift and all associated media have been deleted.' });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message || 'Failed to delete gift.' });
  }
});

export default app;
