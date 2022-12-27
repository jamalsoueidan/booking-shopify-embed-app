import CollectionModel from "@models/collection.model";
import ProductModel, { IProductModel } from "@models/product.model";
import CollectionService from "@services/collection.service";
import { Session } from "@shopify/shopify-api/dist/auth/session";
import { getCollection } from "./collection.helpers";

export enum ControllerMethods {
  get = "get",
  create = "create",
  remove = "remove",
}

interface CreateQuery {
  session: Session;
  shop: string;
}

const create = async ({
  query,
  body,
}: {
  query: CreateQuery;
  body: CollectionBodyCreate;
}) => {
  const { session, shop } = query;

  const selections = body.selections;
  const collections = (
    await Promise.all(selections.map((id) => getCollection(session, id)))
  ).filter((el) => el != null);

  const getGid = (value: string): number =>
    parseInt(value.substring(value.lastIndexOf("/") + 1));

  //TODO: What about the products that are removed from the collections, they needs to be removed also or moved?
  const collectionBulkWrite = collections?.map((c) => {
    return {
      updateOne: {
        filter: { collectionId: getGid(c.id) },
        update: {
          $set: { shop, title: c.title, collectionId: getGid(c.id) },
        },
        upsert: true,
      },
    };
  });

  const products = collections?.reduce<Array<Partial<IProductModel>>>(
    (products, currentCollection) => {
      currentCollection.products.nodes.forEach((n) => {
        products.push({
          shop,
          collectionId: getGid(currentCollection.id),
          productId: getGid(n.id),
          title: n.title,
        });
      });
      return products;
    },
    []
  );

  let cleanupProducts = await ProductModel.find(
    { collectionId: { $in: products?.map((p) => p.collectionId) } },
    "collectionId productId"
  );

  cleanupProducts = cleanupProducts.filter(
    (p) =>
      !products.find(
        (pp: IProductModel) =>
          pp.collectionId === p.collectionId && pp.productId === p.productId
      )
  );

  const productsBulkWrite = products.map((product) => {
    return {
      updateOne: {
        filter: { productId: product.productId },
        update: {
          $set: product,
        },
        upsert: true,
      },
    };
  });

  const productsDeleteOne = cleanupProducts.map((product) => {
    return {
      deleteOne: {
        filter: { ...product },
      },
    };
  });

  return {
    collections: await CollectionModel.bulkWrite(collectionBulkWrite),
    products: await ProductModel.bulkWrite([
      ...productsBulkWrite,
      ...productsDeleteOne,
    ]),
  };
};

interface DeleteQuery {
  shop: string;
  id: string;
}

const remove = async ({ query }: { query: DeleteQuery }) => {
  const { shop, id } = query;

  const collection = await CollectionService.findOne({ shop, _id: id });

  if (collection) {
    return {
      collection: await CollectionModel.deleteOne({ shop, _id: id }),
      products: await ProductModel.deleteMany({
        collectionId: collection.collectionId,
      }),
    };
  }
};

const get = () => CollectionService.findAll();

export default { create, get, remove };
