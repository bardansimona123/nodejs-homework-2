require("dotenv").config();
const sendEmail = require("../utils/sendEmail");

(async () => {
    try {
        await sendEmail("bardanlavinia1999@gmail.com", "token-de-verificare-test");
        console.log("Email trimis cu succes!");
    } catch (error) {
        console.error("Eroare la trimiterea emailului:", error);
    }
})();        