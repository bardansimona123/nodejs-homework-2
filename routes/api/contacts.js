import express from 'express';
import contacts from '../../models/contacts.js';
import Joi from 'joi';

const router = express.Router();

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

router.get('/', async (req, res) => {
  try {
    const allContacts = await contacts.listContacts();
    res.json(allContacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:contactId', async (req, res) => {
  const { contactId } = req.params;
  try {
    const contact = await contacts.getContactById(contactId);
    if (!contact) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  const { error } = contactSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: `missing required ${error.details[0].path[0]} field` });
  }
  try {
    const newContact = await contacts.addContact(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:contactId', async (req, res) => {
  const { contactId } = req.params;
  try {
    const deletedContact = await contacts.removeContact(contactId);
    if (!deletedContact) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.json({ message: 'contact deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:contactId', async (req, res) => {
  const { contactId } = req.params;
  if (!req.body.name && !req.body.email && !req.body.phone) {
    return res.status(400).json({ message: 'missing fields' });
  }
  try {
    const updatedContact = await contacts.updateContact(contactId, req.body);
    if (!updatedContact) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.json(updatedContact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
