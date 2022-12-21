import StaffModel from "@models/staff.model";

const create = (document) => {
  const newStaff = new StaffModel(document);
  return newStaff.save();
};

const find = (shop) => {
  return StaffModel.find({ shop });
};

const findOne = (_id, document) => {
  return StaffModel.findOne({ _id, ...document });
};

const findByIdAndUpdate = (staffId, document) => {
  return StaffModel.findByIdAndUpdate(staffId, document, {
    new: true,
  });
};

export default { create, find, findOne, findByIdAndUpdate };
