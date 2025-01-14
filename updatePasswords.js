const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/user");  // Adaptează calea către modelul tău User

// Conectează-te la baza de date MongoDB cu opțiuni suplimentare
mongoose.connect('mongodb+srv://bardansimona2006:dbBardanSimona123%40@cluster0.pwuzq.mongodb.net/db-contacts?retryWrites=true&w=majority', 
 ).then(() => {
  console.log("Connected to MongoDB");
  addPasswords();  // Apelează funcția de actualizare parole
}).catch(err => {
  console.error("Error connecting to MongoDB:", err);
});

const addPasswords = async () => {
  try {
    const users = await User.find();  // Găsește toți utilizatorii
    console.log(`Found ${users.length} users`);

    for (let user of users) {
      if (!user.password) {  // Dacă utilizatorul nu are o parolă
        console.log(`Adding password for user: ${user.email}`);
        const hashedPassword = await bcrypt.hash("defaultPassword123", 10);  // Poți înlocui cu o parolă dorită
        user.password = hashedPassword;
        await user.save();  // Salvează utilizatorul cu parola criptată
        console.log(`Password added for user: ${user.email}`);
      } else {
        console.log(`User ${user.email} already has a password`);
      }
    }
  } catch (err) {
    console.error("Error updating users:", err);
  } finally {
    mongoose.disconnect();  // Închide conexiunea la MongoDB
    console.log("Disconnected from MongoDB");
  }
};
