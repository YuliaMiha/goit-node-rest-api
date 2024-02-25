const fs = require("fs/promises");
const path = require("path");
const { randomBytes } = require("crypto");

const contactsPath = path.join(__dirname, "db/contacts.json");

function generateUniqueId(length = 10) {
  const bytes = randomBytes(length);
  return bytes.toString("hex");
}

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    return contacts;
  } catch (error) {
    console.error(
      `Error in contacts.js while receiving contacts, read the error, please: ${" "}
        ${error}`
    );
    return null;
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    const result = contacts.find((contact) => contact.id === contactId);
    return result || null;
  } catch (error) {
    console.error(`Error in contacts.js while retrieving contact by ID, read the error, please: ${" "}
        ${error}`);
    return null;
  }
}
async function removeContact(contactId) {
  try {
    const contactToRemove = await getContactById(contactId);
    if (!contactToRemove) {
      return null;
    }
    const contacts = await listContacts();
    const updatedContacts = contacts.filter(
      (contact) => contact.id !== contactId
    );
    await fs.writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2));
    return contactToRemove;
  } catch (error) {
    console.error(`Error in contacts.js while deleting contact by ID, read the error, please: ${" "}
        ${error}`);
    return null;
  }
}

async function addContact(name, email, phone) {
  try {
    const contacts = await listContacts();
    const newContact = {
      id: generateUniqueId(),
      name,
      email,
      phone,
    };
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return newContact;
  } catch (error) {
    console.error(`Error in contacts.js while adding contact, read the error, please: ${" "}
          ${error}`);
    return null;
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
