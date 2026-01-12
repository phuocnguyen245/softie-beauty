# Fix Image Upload Issue in Next.js Build

## Problem
- Uploaded images work in dev but not after `npm run build`
- Root cause: Next.js treats `/public` as static at build time

## Solution
- **DO NOT** serve uploaded images directly from `/public`
- Move uploaded files to `/uploads` (outside `/public`)
- Serve images via API route: `/api/files/*`

## Implementation

### 1. Upload API (`/api/upload`)
- Saves files to `/uploads/{type}` (outside `/public`)
- Returns path as `/api/files/{type}/{filename}`

### 2. File Serving API (`/api/files/[...path]`)
- GET route to stream files dynamically
- Works in dev, build, and production
- No rebuild required when uploading images

### 3. Image URL Helper (`lib/image-utils.ts`)
- `getImageUrl()` function converts paths:
  - Old format: `/uploads/...` → `/api/files/...`
  - New format: `/api/files/...` → `/api/files/...`
  - External URLs: `http://...` → `http://...`

### 4. Frontend Updates
- All image components use `getImageUrl()` helper
- Backward compatible with old `/uploads/` format
- JSON stores image URL as `/api/files/...`

## File Structure

```
project-root/
├── public/          # Static files (build-time)
├── uploads/         # Dynamic uploads (runtime)
│   ├── categories/
│   ├── subcategories/
│   └── products/
└── src/
    └── app/
        └── api/
            ├── upload/
            └── files/
                └── [...path]/
```

## Checklist

✅ **npm run build && npm start** → Ảnh vẫn hiện
✅ **Upload ảnh mới** → Không cần rebuild
✅ **JSON chỉ lưu URL** → `/api/files/...`
✅ **Admin UX không đổi** → ImageUpload component hoạt động như cũ
✅ **Backward compatible** → Old `/uploads/` URLs vẫn hoạt động

## Migration Notes

### Old Format (Before Fix)
- Files saved to: `/public/uploads/{type}/`
- JSON stores: `/uploads/{type}/{filename}`
- Served as: Static files from `/public`

### New Format (After Fix)
- Files saved to: `/uploads/{type}/` (outside `/public`)
- JSON stores: `/api/files/{type}/{filename}`
- Served as: Dynamic API route `/api/files/[...path]`

### Backward Compatibility
- `getImageUrl()` automatically converts old format
- Old `/uploads/` URLs in JSON will work
- No need to migrate existing data immediately

## Testing

1. **Build Test:**
   ```bash
   npm run build
   npm start
   # Verify images still display
   ```

2. **Upload Test:**
   - Upload new image in admin
   - Verify it displays without rebuild
   - Check JSON stores `/api/files/...` path

3. **Backward Compatibility:**
   - Old products with `/uploads/...` URLs
   - Should still display correctly
   - `getImageUrl()` handles conversion

## Security

- Path sanitization in `/api/files/[...path]`
- Prevents directory traversal attacks
- Only serves files from `/uploads/` directory
- Validates file extensions for content-type

## Performance

- Cache-Control headers for immutable files
- Direct file streaming (no processing)
- Efficient for production use
