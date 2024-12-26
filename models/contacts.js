const fs = require('fs/promises')
const path = require('path')

const contactsPath = path.join(__dirname, 'contacts.json')
console.log('Contacts path:', contactsPath);
const listContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath, 'utf-8');
    console.log('Data read from file:', data); // Adăugați acest log pentru a verifica ce este citit
    return JSON.parse(data); // Încercați să parsezi JSON-ul
  } catch (error) {
    console.error('Error reading contacts:', error);
    if (error.code === 'ENOENT') {
      return []; 
    }
    throw error; 
  }
};

const getContactById = async (contactId) => {
  const contacts = await listContacts()
  return contacts.find(contact => contact.id === contactId)
}

const removeContact = async (contactId) => {
  const contacts = await listContacts()
  const index = contacts.findIndex(contact => contact.id === contactId)
  if (index === -1) return null

  const [deletedContact] = contacts.splice(index, 1)
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))
  return deletedContact
}

const addContact = async (body) => {
  const contacts = await listContacts()
  const newContact = { ...body, id: generateId() }
  contacts.push(newContact)
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))
  return newContact
}

const updateContact = async (contactId, body) => {
  const contacts = await listContacts()
  const contact = contacts.find(contact => contact.id === contactId)
  if (!contact) return null

  Object.assign(contact, body)
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))
  return contact
}

const generateId = () => {
  return Math.random().toString(36).substr(2, 9) // Basic random ID generator
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact
}
