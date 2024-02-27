import Contact from "../models/contact.js";

export const listContacts = () => Contact.find();

export const getContactsByFilter = (filter, query = {}) =>
  Contact.find(filter, "-createdAt -updatedAt", query);

export const getContactsCountByFilter = (filter) =>
  Contact.countDocuments(filter);

export const getContactById = (id) => {
  return Contact.findById(id);
};

export const addContact = (data) => Contact.create(data);

export const removeContact = (id) => Contact.findByIdAndDelete(id);

export const removeContactByFilter = (filter) =>
  Contact.findOneAndDelete(filter);

export const updateContactById = (id, data) =>
  Contact.findByIdAndUpdate(id, data, { new: true, runValidators: true });

export const updateContactByFilter = (filter, data) =>
  Contact.findOneAndUpdate(filter, data);

export const updateStatusContact = (id, data) =>
  Contact.findByIdAndUpdate(id, data, {
    new: true,
  });
