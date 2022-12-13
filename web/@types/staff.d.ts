interface Staff {
  _id: string;
  shop: string;
  fullname: string;
  email: string;
  phone: string;
  active: boolean;
  avatar: string;
  position: string;
}

interface StaffBodyUpdate extends Partial<Omit<Staff, "_id" | "shop">> {}
