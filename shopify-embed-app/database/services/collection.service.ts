import { CollectionModel } from "@jamalsoueidan/bsb.bsb-pkg";

const findAll = () => {
  return CollectionModel.aggregate<CollectionAggreate>([
    {
      $lookup: {
        from: "Product",
        let: { cID: "$collectionId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$collectionId", "$$cID"] },
                  { $eq: ["$hidden", false] },
                ],
              },
            },
          },
        ],
        as: "products",
      },
    },
    {
      $unwind: { path: "$products" },
    },
    {
      $unwind: { path: "$products.staff", preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: "Staff",
        localField: "products.staff.staff",
        foreignField: "_id",
        as: "products.foreignStaff",
      },
    },
    {
      $unwind: {
        path: "$products.foreignStaff",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        "products.foreignStaff.tag": {
          $cond: {
            if: { $gte: ["$products.staff.tag", 0] },
            then: "$products.staff.tag",
            else: "$$REMOVE",
          },
        },
        "products.staff": {
          $cond: {
            if: { $gte: ["$products.foreignStaff", 0] },
            then: "$products.foreignStaff",
            else: "$$REMOVE",
          },
        },
      },
    },
    {
      $project: {
        "products.foreignStaff": 0,
      },
    },
    //{ $sort: { "products.staff.fullname": 1 } },
    {
      $group: {
        _id: {
          _id: "$_id",
          products: "$products._id",
        },
        collection: { $first: "$$ROOT" },
        staff: { $push: "$products.staff" },
      },
    },
    {
      $addFields: {
        "collection.products.staff": "$staff",
      },
    },
    {
      $project: {
        _id: 0,
        staff: 0,
      },
    },
    //{ $sort: { "products.title": 1 } },
    { $replaceRoot: { newRoot: "$collection" } },
    {
      $group: {
        _id: "$_id",
        collection: { $first: "$$ROOT" },
        products: { $push: "$products" },
      },
    },
    {
      $addFields: {
        "collection.products": "$products",
      },
    },
    {
      $project: {
        products: 0,
      },
    },
    { $replaceRoot: { newRoot: "$collection" } },
    //{ $sort: { title: 1 } },
  ]);
};

const findOne = (documents) => {
  return CollectionModel.findOne(documents);
};

export default { findAll, findOne };
