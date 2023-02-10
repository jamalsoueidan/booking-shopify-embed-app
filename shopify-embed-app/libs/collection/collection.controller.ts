import {
  CollectionBodyCreate,
  CollectionModel,
  CollectionServiceFindAll,
  CollectionServiceFindOne,
  IProduct, ProductModel,
  ShopifyControllerProps,
} from "@jamalsoueidan/pkg.bsb";
import { getCollection } from "./collection.helpers";

export const create = async ({
  body,
  session,
}: ShopifyControllerProps<null, CollectionBodyCreate>) => {
  const { shop } = session;

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

  const products = collections?.reduce<
    Array<Omit<IProduct, "buffertime" | "active" | "duration" | "staff">>
  >((products, currentCollection) => {
    currentCollection.products.nodes.forEach((n) => {
      products.push({
        shop,
        collectionId: getGid(currentCollection.id),
        productId: getGid(n.id),
        title: n.title,
        imageUrl: n.featuredImage?.url,
        hidden: false,
      });
    });
    return products;
  }, []);

  let cleanupProducts = await ProductModel.find(
    { collectionId: { $in: products?.map((p) => p.collectionId) } },
    "collectionId productId",
  );

  cleanupProducts = cleanupProducts.filter(
    (p) =>
      !products.find(
        (pp) =>
          pp.collectionId === p.collectionId && pp.productId === p.productId,
      ),
  );

  const productsHide = cleanupProducts.map((product) => {
    return {
      updateOne: {
        filter: { _id: product._id },
        update: {
          $set: { hidden: true, active: false },
        },
      },
    };
  });

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

  return {
    collections: await CollectionModel.bulkWrite(collectionBulkWrite),
    products: await ProductModel.bulkWrite([
      ...productsBulkWrite,
      ...productsHide,
    ]),
  };
};

interface DeleteQuery {
  id: string;
}

export const remove = async ({
  query,
}: ShopifyControllerProps<DeleteQuery>) => {
  const { shop, id } = query;

  const collection = await CollectionServiceFindOne({ shop, _id: id });

  if (collection) {
    return {
      collection: await CollectionModel.deleteOne({ shop, _id: id }),
      products: await ProductModel.updateMany(
        {
          collectionId: collection.collectionId,
        },
        {
          $set: {
            hidden: true,
            active: false,
          },
        },
      ),
    };
  }
};

export const get = () => CollectionServiceFindAll();
