# Hướng dẫn sử dụng Admin Panel

## Tổng quan

Module Admin Panel cho phép quản lý sản phẩm (CRUD) thông qua giao diện web, với dữ liệu được lưu trữ trong file JSON.

## Cấu trúc thư mục

```
src/
├── app/
│   ├── api/
│   │   └── products/
│   │       ├── route.ts          # GET, POST /api/products
│   │       └── [id]/
│   │           └── route.ts      # PUT, DELETE /api/products/[id]
│   └── admin/
│       └── products/
│           └── page.tsx           # Admin page UI
├── components/
│   ├── admin/
│   │   └── ProductForm.tsx        # Form component cho Create/Update
│   └── ui/
│       ├── input.tsx              # Input component
│       └── label.tsx              # Label component
└── lib/
    └── products-api.ts            # Utility functions để đọc/ghi JSON
```

## API Routes

### GET /api/products
- **Mô tả**: Lấy danh sách tất cả sản phẩm
- **Response**: 
  ```json
  {
    "success": true,
    "data": [...]
  }
  ```

### POST /api/products
- **Mô tả**: Tạo sản phẩm mới
- **Body**:
  ```json
  {
    "name": "string",
    "price": "number",
    "image": "string (URL)",
    "description": "string",
    "parentCategory": "string",
    "subcategory": "string",
    "variants": [{"name": "string", "price": "number"}] // optional
  }
  ```

### PUT /api/products/[id]
- **Mô tả**: Cập nhật sản phẩm theo ID
- **Body**: Giống POST

### DELETE /api/products/[id]
- **Mô tả**: Xóa sản phẩm theo ID
- **Response**: 
  ```json
  {
    "success": true,
    "data": {...},
    "message": "Product deleted successfully"
  }
  ```

## Tính năng

### 1. Xem danh sách sản phẩm
- Hiển thị tất cả sản phẩm trong bảng
- Hiển thị thông tin: ID, hình ảnh, tên, giá, danh mục, biến thể

### 2. Thêm sản phẩm mới
- Click nút "Thêm sản phẩm"
- Điền form với các trường bắt buộc
- Có thể thêm biến thể (variants) tùy chọn
- Slug tự động được tạo từ tên sản phẩm

### 3. Chỉnh sửa sản phẩm
- Click icon bút chì trên sản phẩm cần sửa
- Form sẽ tự động điền dữ liệu hiện tại
- Có thể thêm/xóa biến thể

### 4. Xóa sản phẩm
- Click icon thùng rác
- Có xác nhận trước khi xóa
- Sau khi xóa, danh sách tự động refresh

## Cách sử dụng

1. **Truy cập Admin Panel**:
   ```
   http://localhost:3000/admin/products
   ```

2. **Thêm sản phẩm**:
   - Click "Thêm sản phẩm"
   - Điền đầy đủ thông tin
   - Click "Tạo mới"

3. **Sửa sản phẩm**:
   - Click icon ✏️ trên sản phẩm
   - Chỉnh sửa thông tin
   - Click "Cập nhật"

4. **Xóa sản phẩm**:
   - Click icon 🗑️ trên sản phẩm
   - Xác nhận trong dialog

## Lưu ý kỹ thuật

- **File JSON**: Dữ liệu được lưu tại `src/constants/product.json`
- **ID tự động**: ID mới được tạo tự động (max ID + 1)
- **Slug tự động**: Slug được tạo từ tên sản phẩm (lowercase, ký tự đặc biệt được thay thế)
- **Validation**: Tất cả trường bắt buộc phải được điền
- **Error Handling**: Có xử lý lỗi đầy đủ với try/catch
- **UI Refresh**: Sau mỗi thao tác CRUD, danh sách tự động refresh

## Mở rộng

Để thêm tính năng mới:
1. Thêm field vào form trong `ProductForm.tsx`
2. Cập nhật validation trong API routes
3. Cập nhật type definition trong `src/types/index.d.ts`
