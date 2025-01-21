const { MailerSend, Recipient, EmailParams } = require("mailersend");

const mailersend = new MailerSend({
    apiKey: process.env.MAILERSEND_API_KEY, // Asigură-te că ai setat cheia în .env
});

const sendEmail = async (email, verificationToken) => {
    const recipients = [new Recipient(email, "User")];

    const emailParams = new EmailParams();
    emailParams.setFrom("bardan.simona2006@gmail.com"); // Schimbă cu adresa ta autorizată
    emailParams.setFromName("Simona"); // Numele expeditorului
    emailParams.setRecipients(recipients);
    emailParams.setSubject("Verify your email");
    emailParams.setHtml(
        `Click <a href="${process.env.BASE_URL}/api/users/verify/${verificationToken}">aici</a> pentru a-ți verifica emailul.`
    );
    emailParams.setText(
        `Click pe linkul următor pentru a-ți verifica emailul: ${process.env.BASE_URL}/api/users/verify/${verificationToken}`
    );

    await mailersend.send(emailParams);
};

module.exports = sendEmail;
