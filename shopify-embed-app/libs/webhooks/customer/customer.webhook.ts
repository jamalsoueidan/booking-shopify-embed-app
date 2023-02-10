import { CustomerModel } from "@jamalsoueidan/pkg.bsb";

interface CreateReturn {
  acknowledged: boolean;
  modifiedCount: number;
  upsertedCount: number;
  matchedCount: number;
}

interface CreateProps {
  body: Customer.Data;
  shop: string;
}

export const modify = async ({
  body,
  shop,
}: CreateProps): Promise<CreateReturn> => {
  const firstName = body.first_name || body.default_address.first_name;
  const lastName = body.last_name || body.default_address.last_name;
  const phone = body.phone || body.default_address.phone;
  const email = body.email;

  return await CustomerModel.updateOne(
    {
      customerId: body.default_address.customer_id,
      shop,
    },
    {
      $set: {
        customerId: body.default_address.customer_id,
        firstName,
        lastName,
        phone,
        email,
        shop,
      },
    },
    {
      upsert: true,
    },
  );
};
