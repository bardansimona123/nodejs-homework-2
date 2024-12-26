const express = require("express");
const Joi = require("joi");
const { listContacts, getContactById, addContact, removeContact } = require("../../models/contacts");

const router = express.Router();

// GET /api/contacts - pentru a obține lista de contacte
router.get("/", async (req, res) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/contacts/:id - pentru a obține un contact după ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const contact = await getContactById(id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/contacts - pentru a adăuga un nou contact
router.post("/", async (req, res) => {
  const { name, phone, email } = req.body;

  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    phone: Joi.string().required(),
    email: Joi.string().email().required(),
  });

  const { error } = schema.validate({ name, phone, email });
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const newContact = await addContact({ name, phone, email });
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/contacts/:id - pentru a șterge un contact
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedContact = await removeContact(id);
    if (!deletedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
