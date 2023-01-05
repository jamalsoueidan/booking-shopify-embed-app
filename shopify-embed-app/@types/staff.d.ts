interface Staff {
  _id: string;
  shop: string;
  fullname: string;
  email: string;
  phone: string;
  active: boolean;
  avatar: string;
  position: string;
  postal: number;
  address: string;
}

interface StaffBodyUpdate extends Partial<Omit<Staff, "_id" | "shop">> {}
interface StaffBodyCreate extends Omit<Staff, "_id" | "shop"> {}
