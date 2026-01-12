# Hướng dẫn Upload/Import Image cho Admin

## Tổng quan

Hệ thống upload ảnh cho phép admin upload ảnh local và lưu vào `/public/uploads` thay vì sử dụng cloud storage.

## Cấu trúc

### API Route
- `POST /api/upload` - Upload image file

### Component
- `ImageUpload` - Component upload với preview

### Storage
- Files lưu tại: `/public/uploads/{type}/`
- Types: `categories`, `subcategories`, `products`

## API Upload

### POST /api/upload

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Fields:
  - `file`: Image file (File)
  - `type`: `categories` | `subcategories` | `products` (string)

**Validation:**
- File type: `image/jpeg`, `image/jpg`, `image/png`, `image/webp`, `image/gif`
- Max size: 5MB
- Type phải là một trong: `categories`, `subcategories`, `products`

**Response:**
```json
{
  "success": true,
  "path": "/uploads/products/abc-123.jpg"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message"
}
```

## ImageUpload Component

### Props
```typescript
interface ImageUploadProps {
  value?: string;        // Current image URL or path
  onChange: (path: string) => void;  // Callback when image changes
  type: 'categories' | 'subcategories' | 'products';
  label?: string;        // Label text (default: "Hình ảnh")
  required?: boolean;    // Is required (default: false)
}
```

### Features
- **Preview**: Hiển thị preview ảnh trước khi submit
- **Upload**: Tự động upload khi chọn file
- **Remove**: Xóa ảnh đã chọn
- **Validation**: Kiểm tra file type và size
- **Loading state**: Hiển thị trạng thái đang upload

### Usage
```tsx
<ImageUpload
  value={formData.image}
  onChange={(path) => setFormData({ ...formData, image: path })}
  type="products"
  label="Hình ảnh sản phẩm"
  required
/>
```

## Logic Update

### Khi tạo mới
1. User chọn file
2. Component tự động upload
3. Lấy path từ API response
4. Gửi path cùng data khi submit form

### Khi cập nhật
1. Nếu **không chọn ảnh mới**:
   - Giữ nguyên ảnh cũ (value từ product.image)
   - Không gọi API upload
   - Gửi path cũ khi submit

2. Nếu **upload ảnh mới**:
   - Upload ảnh mới
   - Lấy path mới
   - Ghi đè path trong formData
   - Gửi path mới khi submit
   - (Optional) Có thể xóa ảnh cũ sau khi update thành công

## File Structure

```
public/
└── uploads/
    ├── categories/
    │   └── {uuid}.{ext}
    ├── subcategories/
    │   └── {uuid}.{ext}
    └── products/
        └── {uuid}.{ext}
```

## File Naming

- Format: `{uuid}.{extension}`
- Example: `a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg`
- UUID được generate tự động để tránh conflict

## Integration với ProductForm

### Trước (URL input):
```tsx
<Input
  type="url"
  value={formData.image}
  onChange={handleInputChange}
  placeholder="https://example.com/image.jpg"
/>
```

### Sau (ImageUpload):
```tsx
<ImageUpload
  value={formData.image}
  onChange={(path) => setFormData({ ...prev, image: path })}
  type="products"
  required
/>
```

### Handle Submit:
```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // If editing and no new image, keep old image
  const imagePath = formData.image || (product?.image || '');
  
  if (!imagePath) {
    throw new Error('Vui lòng chọn hoặc upload ảnh');
  }
  
  const productData = {
    ...formData,
    image: imagePath,
    // ... other fields
  };
  
  // Submit to API
};
```

## Error Handling

### Frontend
- File type validation
- File size validation (5MB)
- Upload error handling
- Display error messages

### Backend
- File validation
- Directory creation
- File write error handling
- Return clear error messages

## Security Considerations

1. **File Type Validation**: Chỉ cho phép image types
2. **File Size Limit**: Giới hạn 5MB
3. **Directory Traversal**: Validate type parameter
4. **Unique Filenames**: UUID để tránh overwrite

## Future Enhancements

1. **Image Optimization**: Resize/compress trước khi lưu
2. **Delete Old Images**: Tự động xóa ảnh cũ khi update
3. **Multiple Images**: Support upload nhiều ảnh
4. **Image Cropping**: Crop ảnh trước khi upload
5. **Progress Bar**: Hiển thị progress khi upload

## Testing

### Test Cases
1. Upload ảnh hợp lệ → Success
2. Upload file không phải ảnh → Error
3. Upload ảnh > 5MB → Error
4. Upload với type không hợp lệ → Error
5. Update product không chọn ảnh mới → Giữ ảnh cũ
6. Update product với ảnh mới → Thay ảnh mới

## Notes

- Files được lưu trong `public/uploads` nên có thể truy cập trực tiếp qua URL
- Path trả về từ API là relative path: `/uploads/{type}/{filename}`
- Next.js sẽ serve files từ `public/` folder tự động
- Không cần cấu hình thêm cho static file serving
