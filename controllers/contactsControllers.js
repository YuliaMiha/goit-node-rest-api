import * as contactsService from "../services/contactsServices.js";
import fs from "fs/promises";
import path from "path";

import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

const contactsDir = path.resolve("public", "contacts");

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const result = await contactsService.getContactsByFilter(
    { owner },
    { skip, limit }
  );
  const total = await contactsService.getContactsCountByFilter({ owner });
  res.json({
    total,
    result,
  });
};

const getOneContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await contactsService.getContactsByFilter({ _id: id, owner });
  if (!result) {
    throw HttpError(404, `Not found`);
  }
  res.json(result);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await contactsService.removeContactByFilter({
    _id: id,
    owner,
  });
  if (!result) {
    throw HttpError(404, `Not found`);
  }
  res.json(result);
};

const createContact = async (req, res) => {
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(contactsDir, filename);
  await fs.rename(oldPath, newPath);

  const { _id: owner } = req.user;
  const photo = path.join("contacts", filename);
  const result = await contactsService.addContact({
    ...req.body,
    photo,
    owner,
  });

  res.status(201).json(result);
};

const updateContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await contactsService.updateContactByFilter(
    { _id: id, owner },
    req.body
  );
  if (!result) {
    throw HttpError(404, `Not found`);
  }

  res.json(result);
};

const updateStatusContact = async (req, res) => {
  const { id } = req.params;

  const result = await contactsService.updateStatusContact(id, req.body);
  if (!result) {
    throw HttpError(404);
  }
  res.status(200).json(result);
};

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  deleteContact: ctrlWrapper(deleteContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
