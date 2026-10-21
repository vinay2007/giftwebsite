import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { put, del, list } from '@vercel/blob';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON bodies (up to 50MB for JSON payloads with small inline data if any)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Helper to check if Vercel Blob is configured
function isBlobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN && process.env.BLOB_READ_WRITE_TOKEN.trim().length > 0);
}

// -------------------------------------------------------------
// 1. API: System Status
// -------------------------------------------------------------
app.get('/api/status', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    blobConfigured: isBlobConfigured(),
    message: isBlobConfigured()
      ? 'Vercel Blob is configured and ready.'
      : 'Vercel Blob is not configured. Set BLOB_READ_WRITE_TOKEN in environment variables.',
  });
});

// -------------------------------------------------------------
// 2. API: Vercel Blob Client Upload Handler
// -------------------------------------------------------------
app.post('/api/blob/upload', async (req: Request, res: Response): Promise<void> => {
  if (!isBlobConfigured()) {
    res.status(503).json({
      error: 'BLOB_NOT_CONFIGURED',
      message: 'Vercel Blob storage is not configured. Please add BLOB_READ_WRITE_TOKEN to your environment.',
    });
    return;
  }

  try {
    const jsonResponse = await handleUpload({
      body: req.body as HandleUploadBody,
      request: req,
      onBeforeGenerateToken: async (pathname: string) => {
        // Enforce safe path scoping
        if (!pathname.startsWith('gifts/')) {
          throw new Error('Invalid destination path. Must be inside gifts/.');
        }

        return {
          allowedContentTypes: [
            // Images
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif',
            'image/heic',
            'image/heif',
            // Audio
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
          maximumSizeInBytes: 60 * 1024 * 1024, // 60 MB limit
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
    console.error('[Vercel Blob] Upload token error:', err);
    res.status(400).json({ error: err.message || 'Failed to process blob upload' });
  }
});

// -------------------------------------------------------------
// 3. API: Publish Gift
// -------------------------------------------------------------
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
    // Generate unpredictable public ID (e.g., gft_4f9a12c8b73e5a01)
    const publicId = 'gft_' + crypto.randomBytes(8).toString('hex');

    // Generate high-entropy secret management recovery key
    const recoveryKey = 'rec_' + crypto.randomBytes(16).toString('hex');
    const recoveryKeyHash = crypto.createHash('sha256').update(recoveryKey).digest('hex');

    // Collect all referenced media URLs for lifecycle tracking
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

    // Prepare public gift record
    const publicGift = {
      ...gift,
      id: publicId,
      isPublished: true,
      publishedAt,
      updatedAt: publishedAt,
    };

    // Prepare private management metadata record
    const metaRecord = {
      publicId,
      recoveryKeyHash,
      themeStyleLocked: gift.theme?.themeStyle || 'midnight',
      publishedAt,
      updatedAt: publishedAt,
      mediaUrls,
    };

    // Store gift.json and meta.json persistently in Vercel Blob
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

    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    const host = req.headers['x-forwarded-host'] || req.get('host') || 'localhost:3000';
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
    console.error('[Publish] Failed to publish gift:', err);
    res.status(500).json({ error: err.message || 'Failed to publish gift.' });
  }
});

// -------------------------------------------------------------
// 4. API: Get Published Gift by Public ID
// -------------------------------------------------------------
app.get('/api/gifts/:id', async (req: Request, res: Response): Promise<void> => {
  if (!isBlobConfigured()) {
    res.status(503).json({
      error: 'BLOB_NOT_CONFIGURED',
      message: 'Vercel Blob storage is not configured.',
    });
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

    // Fetch the stored JSON document from Vercel Blob
    const response = await fetch(targetBlob.url);
    if (!response.ok) {
      res.status(404).json({ error: 'Could not fetch gift data.' });
      return;
    }

    const gift = await response.json();
    res.json({ success: true, gift });
  } catch (error) {
    const err = error as Error;
    console.error('[GetGift] Error reading gift:', err);
    res.status(500).json({ error: err.message || 'Failed to load gift.' });
  }
});

// -------------------------------------------------------------
// 5. API: Update Published Gift (Management Key required)
// -------------------------------------------------------------
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
    // 1. Fetch meta.json
    const metaPrefix = `gifts/${id}/meta.json`;
    const { blobs: metaBlobs } = await list({ prefix: metaPrefix, limit: 1 });
    const metaBlob = metaBlobs.find((b) => b.pathname === metaPrefix);

    if (!metaBlob) {
      res.status(404).json({ error: 'Gift record not found.' });
      return;
    }

    const metaRes = await fetch(metaBlob.url);
    const metaData = await metaRes.json();

    // 2. Validate hash
    const inputHash = crypto.createHash('sha256').update(recoveryKey).digest('hex');
    if (inputHash !== metaData.recoveryKeyHash) {
      res.status(403).json({ error: 'Invalid recovery key.' });
      return;
    }

    // 3. Enforce theme locking
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

    // Update gift.json in Vercel Blob
    await put(`gifts/${id}/gift.json`, JSON.stringify(updatedPublicGift), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
    });

    res.json({ success: true, message: 'Gift updated successfully.', gift: updatedPublicGift });
  } catch (error) {
    const err = error as Error;
    console.error('[UpdateGift] Error updating gift:', err);
    res.status(500).json({ error: err.message || 'Failed to update gift.' });
  }
});

// -------------------------------------------------------------
// 6. API: Delete Published Gift (Management Key required)
// -------------------------------------------------------------
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

    // List all blobs under gifts/${id}/
    const { blobs: allBlobs } = await list({ prefix: `gifts/${id}/` });
    const urlsToDelete = allBlobs.map((b) => b.url);

    if (urlsToDelete.length > 0) {
      await del(urlsToDelete);
    }

    res.json({ success: true, message: 'Published gift and all associated media have been deleted.' });
  } catch (error) {
    const err = error as Error;
    console.error('[DeleteGift] Error deleting gift:', err);
    res.status(500).json({ error: err.message || 'Failed to delete gift.' });
  }
});

// -------------------------------------------------------------
// Server Setup (Vite Middleware in dev / Static in prod)
// -------------------------------------------------------------
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[Server] Somewhere Between Us running on port ${PORT}`);
    console.log(`[Server] Vercel Blob Status: ${isBlobConfigured() ? 'CONFIGURED' : 'NOT CONFIGURED'}`);
  });
}

startServer().catch((err) => {
  console.error('[Server] Failed to start:', err);
});
