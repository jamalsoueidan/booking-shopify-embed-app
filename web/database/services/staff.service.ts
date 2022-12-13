import StaffModel from "@models/staff.model";

const create = async (document) => {
  try {
    const newStaff = new StaffModel(document);
    return await newStaff.save();
  } catch (e) {
    throw e;
  }
};

const find = async (shop) => {
  return await StaffModel.find({ shop });
};

const findOne = async (_id, document) => {
  return await StaffModel.findOne({ _id, ...document });
};

const findByIdAndUpdate = (staffId, document) => {
  return StaffModel.findByIdAndUpdate(staffId, document, {
    new: true,
  });
};

export default { create, find, findOne, findByIdAndUpdate };
