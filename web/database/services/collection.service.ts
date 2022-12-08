import CollectionModel from "@models/Collection.model";

const findAll = async () => {
  return await CollectionModel.aggregate([
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

const findOne = async (documents) => {
  return await CollectionModel.findOne(documents);
};

export default { findAll, findOne };
