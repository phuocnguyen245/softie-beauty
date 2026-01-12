# Hướng dẫn hệ thống Admin - Quản lý Categories, Subcategories & Products

## Tổng quan

Hệ thống Admin hoàn chỉnh cho phép quản lý 3 module chính:
1. **Categories** (Danh mục chính)
2. **Subcategories** (Danh mục con)
3. **Products** (Sản phẩm)

Tất cả dữ liệu được lưu trong file JSON, không sử dụng database.

## Cấu trúc thư mục

```
src/
├── app/
│   ├── api/
│   │   ├── categories/
│   │   │   ├── route.ts              # GET, POST /api/categories
│   │   │   └── [id]/
│   │   │       └── route.ts          # PUT, DELETE /api/categories/[id]
│   │   ├── subcategories/
│   │   │   ├── route.ts              # GET, POST /api/subcategories
│   │   │   └── [id]/
│   │   │       └── route.ts         # PUT, DELETE /api/subcategories/[id]
│   │   └── products/
│   │       ├── route.ts              # GET, POST /api/products
│   │       └── [id]/
│   │           └── route.ts           # PUT, DELETE /api/products/[id]
│   └── admin/
│       ├── categories/
│       │   └── page.tsx              # Admin page quản lý categories
│       ├── subcategories/
│       │   └── page.tsx              # Admin page quản lý subcategories
│       └── products/
│           └── page.tsx              # Admin page quản lý products
├── components/
│   ├── admin/
│   │   └── ProductForm.tsx           # Form component cho Create/Update product
│   └── ui/
│       ├── input.tsx
│       ├── label.tsx
│       └── button.tsx
├── lib/
│   ├── json-utils.ts                 # Helper: readJSON, writeJSON, generateSlug
│   ├── categories-api.ts             # Helper: read/write categories
│   └── products-api.ts                # Helper: read/write products
└── constants/
    ├── category.json                  # File JSON lưu categories
    └── product.json                   # File JSON lưu products
```

## API Routes

### Categories API

#### GET /api/categories
Lấy danh sách tất cả categories
```json
{
  "success": true,
  "data": [
    {
      "id": "False Lashes",
      "name": "False Lashes",
      "slug": "false-lashes",
      "subcategories": [...]
    }
  ]
}
```

#### POST /api/categories
Tạo category mới
```json
Body: { "name": "New Category" }
```

#### PUT /api/categories/[id]
Cập nhật category (id là tên category)
```json
Body: { "name": "Updated Category" }
```

#### DELETE /api/categories/[id]
Xóa category (id là tên category)
- **Ràng buộc**: Không cho xóa nếu:
  - Có subcategories liên kết
  - Hoặc có products liên kết

### Subcategories API

#### GET /api/subcategories?categoryId=
Lấy danh sách subcategories (có thể filter theo categoryId)
```json
{
  "success": true,
  "data": [
    {
      "id": "Natural Lashes",
      "name": "Natural Lashes",
      "slug": "natural-lashes",
      "categoryId": "False Lashes"
    }
  ]
}
```

#### POST /api/subcategories
Tạo subcategory mới
```json
Body: {
  "name": "New Subcategory",
  "categoryId": "False Lashes"
}
```

#### PUT /api/subcategories/[id]
Cập nhật subcategory (id là tên subcategory)
```json
Body: {
  "name": "Updated Subcategory",
  "categoryId": "False Lashes"
}
```

#### DELETE /api/subcategories/[id]?categoryId=
Xóa subcategory
- **Ràng buộc**: Không cho xóa nếu có products liên kết

### Products API

#### GET /api/products
Lấy danh sách tất cả products

#### POST /api/products
Tạo product mới
- **Validation**: Kiểm tra category và subcategory có tồn tại và hợp lệ

#### PUT /api/products/[id]
Cập nhật product
- **Validation**: Kiểm tra category và subcategory có tồn tại và hợp lệ

#### DELETE /api/products/[id]
Xóa product

## Logic ràng buộc

### 1. Category
- ❌ **Không thể xóa** nếu:
  - Có subcategories liên kết
  - Hoặc có products liên kết

### 2. Subcategory
- ❌ **Không thể xóa** nếu:
  - Có products liên kết

### 3. Product
- ✅ **Có thể xóa** bất cứ lúc nào
- ✅ **Validation**: Category và subcategory phải tồn tại và hợp lệ khi tạo/cập nhật

## Admin Pages

### 1. /admin/categories
- Hiển thị danh sách categories
- Thêm / Sửa / Xóa category
- Hiển thị số lượng subcategories
- Có confirm dialog khi xóa

### 2. /admin/subcategories
- Hiển thị danh sách subcategories
- Filter theo category (dropdown)
- Thêm / Sửa / Xóa subcategory
- Hiển thị category cha
- Có confirm dialog khi xóa

### 3. /admin/products
- Hiển thị danh sách products
- Thêm / Sửa / Xóa product
- Form tự động load subcategories khi chọn category
- Hiển thị category và subcategory trong bảng
- Có confirm dialog khi xóa

## Cách sử dụng

### Quản lý Categories
1. Truy cập: `http://localhost:3000/admin/categories`
2. Click "Thêm danh mục" → Nhập tên → "Tạo mới"
3. Click icon ✏️ để sửa
4. Click icon 🗑️ để xóa (sẽ báo lỗi nếu có ràng buộc)

### Quản lý Subcategories
1. Truy cập: `http://localhost:3000/admin/subcategories`
2. Chọn category để filter (hoặc để "Tất cả")
3. Click "Thêm danh mục con" → Chọn category cha → Nhập tên → "Tạo mới"
4. Click icon ✏️ để sửa
5. Click icon 🗑️ để xóa (sẽ báo lỗi nếu có products)

### Quản lý Products
1. Truy cập: `http://localhost:3000/admin/products`
2. Click "Thêm sản phẩm"
3. Chọn category → Subcategories sẽ tự động load
4. Điền đầy đủ thông tin → "Tạo mới"
5. Click icon ✏️ để sửa
6. Click icon 🗑️ để xóa

## Helper Functions

### json-utils.ts
- `readJSON<T>(filePath)`: Đọc file JSON
- `writeJSON<T>(filePath, data)`: Ghi file JSON
- `generateSlug(text)`: Tạo slug từ text

### categories-api.ts
- `readCategories()`: Đọc categories từ JSON
- `writeCategories(categories)`: Ghi categories vào JSON
- `getSubcategoriesByCategory(categoryId)`: Lấy subcategories của category
- `hasSubcategories(categoryId)`: Kiểm tra category có subcategories
- `subcategoryExists(categoryId, subcategoryName)`: Kiểm tra subcategory tồn tại

### products-api.ts
- `readProducts()`: Đọc products từ JSON
- `writeProducts(products)`: Ghi products vào JSON
- `getNextProductId()`: Tạo ID mới cho product
- `hasProductsInCategory(categoryId)`: Kiểm tra category có products
- `hasProductsInSubcategory(subcategoryName)`: Kiểm tra subcategory có products

## Lưu ý kỹ thuật

1. **File JSON**: 
   - Categories: `src/constants/category.json`
   - Products: `src/constants/product.json`

2. **ID System**:
   - Category ID: Sử dụng tên category làm ID
   - Subcategory ID: Sử dụng tên subcategory làm ID
   - Product ID: Số tự động tăng (1, 2, 3...)

3. **Slug**: Tự động tạo từ tên (lowercase, ký tự đặc biệt → hyphen)

4. **Error Handling**: Tất cả API routes có try/catch và trả về error message rõ ràng

5. **Validation**: 
   - Required fields được validate ở cả frontend và backend
   - Category/Subcategory validation khi tạo/cập nhật product

6. **UI/UX**:
   - Loading states
   - Error messages
   - Confirm dialogs
   - Auto-refresh sau CRUD operations
   - Dynamic subcategory loading khi chọn category

## Mở rộng

Để thêm tính năng mới:
1. Thêm field vào form components
2. Cập nhật validation trong API routes
3. Cập nhật type definitions trong `src/types/index.d.ts`
4. Cập nhật helper functions nếu cần

## Production Notes

⚠️ **Lưu ý**: Hệ thống này sử dụng file JSON, phù hợp cho:
- Development
- Small projects
- Prototyping

Không phù hợp cho:
- High traffic applications
- Concurrent writes
- Large datasets

Nếu cần scale, nên migrate sang database (MongoDB, PostgreSQL, etc.)
