const bcrypt = require('bcryptjs');

const password = 'account123'; // Parola introdusă de utilizator
const hashedPassword = '$2a$10$yShM5xTZSGnrGotRUFxkiuw4boG7y9C8rywMJ/Gl620Sw9whYtkbW'; // Parola hash-uită din DB

bcrypt.compare(password, hashedPassword, (err, result) => {
  if (err) throw err;
  console.log(result); // Ar trebui să afișeze true dacă parolele se potrivesc
});
