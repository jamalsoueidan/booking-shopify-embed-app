interface ProductStaff {
  staff: string;
  tag: string;
}
interface Product<T = ProductStaff> {
  _id: string;
  productId: number;
  active: boolean;
  buffertime: number;
  collectionId: number;
  duration: number;
  shop: string;
  title: string;
  staff: T[];
}

// api/admin/products/:id
interface ProductStaffAggreate extends Partial<Staff> {
  tag: string;
}

interface ProductAggreate extends Omit<Product, "staff"> {
  staff: ProductStaffAggreate[];
}

// api/admin/products/:id/staff
interface ProductAddStaff extends Staff {
  tags: string[];
}

// PUT api/admin/products/6383820e2817210cda196c4d
interface ProductUpdateBody
  extends Partial<Pick<Product, "duration" | "buffertime" | "active">> {
  staff?: ProductStaffAggreate[];
}
