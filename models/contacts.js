const mongoose = require('mongoose');

// Definirea schema pentru contacte
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Set name for contact'],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

const Contact = mongoose.model('Contact', contactSchema);

// Funcții de CRUD folosind Mongoose
const listContacts = async () => {
  return await Contact.find();
};

const getContactById = async (contactId) => {
  return await Contact.findById(contactId);
};

const addContact = async (body) => {
  const newContact = new Contact(body);
  await newContact.save();
  return newContact;
};

const removeContact = async (contactId) => {
  return await Contact.findByIdAndRemove(contactId);
};

const updateContact = async (contactId, body) => {
  return await Contact.findByIdAndUpdate(contactId, body, { new: true });
};

// Funcție pentru actualizarea statutului favorite
const updateStatusContact = async (contactId, body) => {
  return await Contact.findByIdAndUpdate(
    contactId,
    { favorite: body.favorite },
    { new: true }
  );
};

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
};
