# Admin System Hoàn Chỉnh - Next.js App Router

## Tổng quan

Hệ thống Admin hoàn chỉnh với Layout, Sidebar navigation, Dashboard và quản lý Categories, Subcategories, Products.

## Cấu trúc thư mục

```
src/
├── app/
│   ├── admin/
│   │   ├── layout.tsx                    # Admin Layout với Sidebar
│   │   ├── page.tsx                      # Dashboard homepage
│   │   ├── categories/
│   │   │   ├── page.tsx                  # List categories
│   │   │   └── [id]/
│   │   │       └── page.tsx              # Manage subcategories
│   │   └── products/
│   │       └── page.tsx                  # Manage products
│   └── api/
│       ├── categories/
│       │   ├── route.ts                  # GET, POST /api/categories
│       │   ├── [id]/
│       │   │   ├── route.ts              # PUT, DELETE /api/categories/[id]
│       │   │   └── subcategories/
│       │   │       ├── route.ts          # GET, POST /api/categories/[id]/subcategories
│       │   │       └── [subId]/
│       │   │           └── route.ts       # PUT, DELETE /api/categories/[id]/subcategories/[subId]
│       └── products/
│           ├── route.ts                  # GET, POST /api/products
│           └── [id]/
│               └── route.ts              # PUT, DELETE /api/products/[id]
├── components/
│   ├── admin/
│   │   ├── AdminSidebar.tsx             # Sidebar navigation component
│   │   └── ProductForm.tsx              # Form component cho products
│   └── ui/
│       ├── button.tsx
│       ├── input.tsx
│       └── label.tsx
└── lib/
    ├── json-utils.ts                    # Helper: readJSON, writeJSON
    ├── categories-api.ts                 # Helper: categories operations
    └── products-api.ts                  # Helper: products operations
```

## 1. Admin Layout & Sidebar

### Layout (`src/app/admin/layout.tsx`)
- Wrapper cho tất cả admin pages
- Fixed sidebar bên trái
- Main content area với padding

### Sidebar (`src/components/admin/AdminSidebar.tsx`)
- **Fixed sidebar** với width 256px
- **Active link highlight** dựa trên pathname
- **Mobile responsive** với hamburger menu
- **Navigation links**:
  - Dashboard (`/admin`)
  - Categories (`/admin/categories`)
  - Products (`/admin/products`)

**Features:**
- Active state highlighting
- Mobile menu toggle
- Overlay cho mobile
- Icons từ lucide-react

## 2. Dashboard (`/admin`)

### Stats Cards
- **Total Categories**: Số lượng categories
- **Total Subcategories**: Tổng số subcategories
- **Total Products**: Số lượng products

### Quick Actions
- Thêm Category
- Thêm Product
- Quản lý Categories
- Quản lý Products

### Recent Categories
- Bảng hiển thị 5 categories gần đây
- Thông tin: Tên, Slug, Số subcategories
- Nút "Quản lý" để navigate đến detail page

## 3. Categories Management

### `/admin/categories` - List Categories
- Danh sách tất cả categories
- Thông tin: Tên, Slug, Số subcategories
- Actions:
  - **Quản lý Subcategories**: Navigate đến `/admin/categories/[id]`
  - **Sửa**: Edit category name
  - **Xóa**: Delete category (có ràng buộc)

### `/admin/categories/[id]` - Manage Subcategories
- Hiển thị thông tin category
- Danh sách subcategories thuộc category đó
- CRUD subcategories:
  - Thêm subcategory mới
  - Sửa subcategory
  - Xóa subcategory (có ràng buộc)
- Nút "Quay lại" để quay về list

## 4. Products Management

### `/admin/products` - List Products
- Danh sách tất cả products
- Thông tin: ID, Hình ảnh, Tên, Giá, Category, Subcategory, Variants
- Actions:
  - **Sửa**: Edit product
  - **Xóa**: Delete product

### Product Form
- **Select Category**: Dropdown chọn category
- **Subcategory Dropdown**: 
  - Tự động load khi chọn category
  - Chỉ hiện subcategories của category đã chọn
  - Reset khi đổi category
- **Validation**: Category và subcategory phải hợp lệ

## 5. API Routes

### Categories
- `GET /api/categories` - Lấy danh sách
- `POST /api/categories` - Tạo mới
- `PUT /api/categories/[id]` - Cập nhật
- `DELETE /api/categories/[id]` - Xóa (có ràng buộc)

### Subcategories (Nested)
- `GET /api/categories/[id]/subcategories` - Lấy subcategories
- `POST /api/categories/[id]/subcategories` - Tạo subcategory
- `PUT /api/categories/[id]/subcategories/[subId]` - Cập nhật
- `DELETE /api/categories/[id]/subcategories/[subId]` - Xóa (có ràng buộc)

### Products
- `GET /api/products` - Lấy danh sách
- `POST /api/products` - Tạo mới (validate category/subcategory)
- `PUT /api/products/[id]` - Cập nhật (validate category/subcategory)
- `DELETE /api/products/[id]` - Xóa

## 6. Logic ràng buộc

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

## 7. UX Features

### Sidebar
- Fixed position, không scroll
- Active link highlight
- Mobile responsive với hamburger menu
- Smooth transitions

### Dashboard
- Stats cards với icons
- Quick actions buttons
- Recent items table
- Loading states

### Forms
- Inline forms (không dùng modal)
- Validation messages
- Loading states
- Auto-reset khi cần

### Navigation
- Breadcrumb navigation (implicit)
- Back buttons ở detail pages
- Quick actions từ dashboard

## 8. Responsive Design

### Desktop (≥1024px)
- Sidebar fixed, luôn hiển thị
- Main content với margin-left 256px
- Full width tables

### Mobile (<1024px)
- Sidebar hidden by default
- Hamburger menu button
- Overlay khi sidebar mở
- Full width layout

## 9. Data Structure

### Category JSON
```json
{
  "parent": "False Lashes",
  "parentSlug": "false-lashes",
  "subcategories": [
    { "name": "Natural Lashes", "slug": "natural-lashes" }
  ]
}
```

### Product JSON
```json
{
  "id": 1,
  "name": "Product Name",
  "slug": "product-name",
  "price": 32.0,
  "image": "https://...",
  "description": "...",
  "parentCategory": "False Lashes",
  "subcategory": "Natural Lashes",
  "variants": [...]
}
```

## 10. Cách sử dụng

### 1. Truy cập Admin
```
http://localhost:3000/admin
```

### 2. Navigation
- Click vào links trong sidebar để navigate
- Active link sẽ được highlight
- Mobile: Click hamburger menu để mở sidebar

### 3. Quản lý Categories
1. Click "Categories" trong sidebar
2. Xem danh sách categories
3. Click "Quản lý Subcategories" để quản lý subcategories
4. Thêm/Sửa/Xóa categories

### 4. Quản lý Products
1. Click "Products" trong sidebar
2. Xem danh sách products
3. Click "Thêm sản phẩm" hoặc icon sửa
4. Chọn category → subcategories tự động load
5. Điền thông tin và lưu

## 11. Best Practices

1. **Layout Consistency**: Tất cả admin pages dùng chung layout
2. **Active States**: Sidebar links highlight khi active
3. **Loading States**: Hiển thị loading khi fetch data
4. **Error Handling**: Try/catch và error messages rõ ràng
5. **Validation**: Validate ở cả frontend và backend
6. **Responsive**: Mobile-first approach
7. **Type Safety**: TypeScript cho type safety
8. **Code Organization**: Tách biệt components, utils, API routes

## 12. Mở rộng

Để thêm tính năng mới:
1. Thêm link vào sidebar navigation
2. Tạo page mới trong `/app/admin/`
3. Tạo API routes nếu cần
4. Cập nhật types nếu cần
5. Thêm stats vào dashboard nếu cần

## 13. Dependencies

- `next`: App Router
- `react`: UI library
- `lucide-react`: Icons
- `tailwindcss`: Styling
- TypeScript: Type safety

## 14. File Storage

- **Categories**: `src/constants/category.json`
- **Products**: `src/constants/product.json`
- Sử dụng `fs/promises` để read/write
- Không dùng database

---

**Hệ thống Admin đã hoàn chỉnh và sẵn sàng sử dụng!** 🎉
