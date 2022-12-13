interface ProductStaff extends Partial<Staff> {
  tag: string;
}

interface Product {
  _id: string;
  productId: number;
  active: boolean;
  buffertime: number;
  collectionId: number;
  duration: number;
  shop: string;
  staff: ProductStaff[];
  title: string;
}

// api/admin/products/:id/staff
interface ProductAddStaff extends Staff {
  tags: string[];
}

// PUT api/admin/products/6383820e2817210cda196c4d
interface ProductUpdateBody
  extends Partial<Pick<Product, "duration" | "buffertime" | "active">> {
  staff?: ProductStaff[];
}

interface ProductStaffUpdateBodyReturn {
  _id: string;
  tag: string;
  staff: string;
}

interface ProductUpdateBodyReturn extends Omit<Product, "staff"> {
  staff: ProductStaffUpdateBodyReturn[];
}
