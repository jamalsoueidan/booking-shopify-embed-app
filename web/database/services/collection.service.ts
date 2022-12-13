import CollectionModel from "@models/collection.model";

const findAll = () => {
  return CollectionModel.aggregate<CollectionAggreate>([
    {
      $lookup: {
        from: "Product",
        localField: "collectionId",
        foreignField: "collectionId",
        as: "products",
      },
    },
  ]);
};

const findOne = (documents) => {
  return CollectionModel.findOne(documents);
};

export default { findAll, findOne };
