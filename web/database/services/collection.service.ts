import collectionModel from "@models/collection.model";

const findAll = async () => {
  return await collectionModel.aggregate([
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
  return await collectionModel.findOne(documents);
};

export default { findAll, findOne };
