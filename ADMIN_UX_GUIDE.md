# Hướng dẫn UX Admin System - Subcategories trong Context của Category

## Tổng quan

Hệ thống Admin được thiết kế với UX rõ ràng: **Subcategory không phải entity độc lập**, mà chỉ tồn tại trong ngữ cảnh của Category.

## Cấu trúc UX

### 1. `/admin/categories` - Quản lý Categories
- **Danh sách categories** với thông tin:
  - Tên category
  - Slug
  - Số lượng subcategories
- **Nút "Quản lý Subcategories"** cho mỗi category
- **Thêm/Sửa/Xóa** category

### 2. `/admin/categories/[id]` - Quản lý Subcategories
- **Hiển thị thông tin category** (header)
- **Danh sách subcategories** thuộc category đó
- **CRUD subcategories** ngay tại đây:
  - Thêm subcategory mới
  - Sửa subcategory
  - Xóa subcategory (có ràng buộc)

### 3. `/admin/products` - Quản lý Products
- **Form tạo/sửa product**:
  - Select Category → Subcategories tự động load
  - Reset subcategory khi đổi category
  - Validation category và subcategory

## API Routes

### Categories
- `GET /api/categories` - Lấy danh sách categories
- `POST /api/categories` - Tạo category mới
- `PUT /api/categories/[id]` - Cập nhật category
- `DELETE /api/categories/[id]` - Xóa category (có ràng buộc)

### Subcategories (Nested trong Category)
- `GET /api/categories/[id]/subcategories` - Lấy subcategories của category
- `POST /api/categories/[id]/subcategories` - Tạo subcategory mới
- `PUT /api/categories/[id]/subcategories/[subId]` - Cập nhật subcategory
- `DELETE /api/categories/[id]/subcategories/[subId]` - Xóa subcategory (có ràng buộc)

### Products
- `GET /api/products` - Lấy danh sách products
- `POST /api/products` - Tạo product mới
- `PUT /api/products/[id]` - Cập nhật product
- `DELETE /api/products/[id]` - Xóa product

## Logic ràng buộc

### Category
❌ **Không thể xóa** nếu:
- Có subcategories liên kết
- Hoặc có products liên kết

### Subcategory
❌ **Không thể xóa** nếu:
- Có products liên kết

### Product
✅ **Có thể xóa** bất cứ lúc nào
✅ **Validation**: Category và subcategory phải tồn tại và hợp lệ

## Data Structure

### Category JSON Structure
```json
{
  "parent": "False Lashes",
  "parentSlug": "false-lashes",
  "subcategories": [
    { "name": "Natural Lashes", "slug": "natural-lashes" },
    { "name": "Dramatic Lashes", "slug": "dramatic-lashes" }
  ]
}
```

**Subcategories được lưu NESTED trong category JSON**, không phải entity độc lập.

## User Flow

### Quản lý Categories & Subcategories

1. **Truy cập** `/admin/categories`
2. **Xem danh sách** categories
3. **Click "Quản lý Subcategories"** trên category cần quản lý
4. **Chuyển đến** `/admin/categories/[id]`
5. **Xem danh sách** subcategories của category đó
6. **Thêm/Sửa/Xóa** subcategories ngay tại đây
7. **Quay lại** danh sách categories

### Tạo/Sửa Product

1. **Truy cập** `/admin/products`
2. **Click "Thêm sản phẩm"** hoặc sửa product
3. **Chọn Category** từ dropdown
4. **Subcategories tự động load** từ API `/api/categories/[id]/subcategories`
5. **Chọn Subcategory** từ dropdown (chỉ hiện subcategories của category đã chọn)
6. **Nếu đổi Category** → Subcategory tự động reset
7. **Điền thông tin** và lưu

## Ưu điểm của thiết kế này

### 1. **UX rõ ràng**
- Subcategory không phải entity độc lập
- Quản lý subcategories trong context của category
- Navigation logic và intuitive

### 2. **API RESTful**
- Nested routes: `/api/categories/[id]/subcategories`
- Phản ánh đúng mối quan hệ parent-child
- Dễ hiểu và maintain

### 3. **Data Structure**
- Subcategories nested trong category JSON
- Không cần join hoặc query phức tạp
- Dữ liệu nhất quán

### 4. **Code Organization**
- Tách biệt rõ ràng giữa categories và subcategories
- Dễ mở rộng và maintain
- Type-safe với TypeScript

## Files Structure

```
src/
├── app/
│   ├── api/
│   │   └── categories/
│   │       ├── route.ts                    # GET, POST /api/categories
│   │       ├── [id]/
│   │       │   ├── route.ts                # PUT, DELETE /api/categories/[id]
│   │       │   └── subcategories/
│   │       │       ├── route.ts             # GET, POST /api/categories/[id]/subcategories
│   │       │       └── [subId]/
│   │       │           └── route.ts         # PUT, DELETE /api/categories/[id]/subcategories/[subId]
│   │       └── products/
│   │           └── ...
│   └── admin/
│       ├── categories/
│       │   ├── page.tsx                     # List categories
│       │   └── [id]/
│       │       └── page.tsx                 # Manage subcategories
│       └── products/
│           └── page.tsx
└── components/
    └── admin/
        └── ProductForm.tsx                  # Form với dynamic subcategory loading
```

## Migration Notes

### Đã xóa:
- ❌ `/admin/subcategories` page
- ❌ `/api/subcategories` routes

### Đã thêm:
- ✅ `/admin/categories/[id]` page
- ✅ `/api/categories/[id]/subcategories` routes
- ✅ Nút "Quản lý Subcategories" trong categories list

### Đã cập nhật:
- ✅ ProductForm: Dùng API mới `/api/categories/[id]/subcategories`
- ✅ Categories page: Thêm nút navigate đến subcategories management

## Best Practices

1. **Luôn quản lý subcategories trong context của category**
2. **Validate category và subcategory khi tạo/cập nhật product**
3. **Kiểm tra ràng buộc trước khi xóa**
4. **Reset subcategory khi đổi category trong form**
5. **Sử dụng nested routes cho nested resources**
