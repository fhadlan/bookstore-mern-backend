require("dotenv").config();
const admin = require("firebase-admin");

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: serviceAccount.project_id,
    private_key_id: serviceAccount.private_key_id,
    privateKey: serviceAccount.private_key.replace(/\\n/g, "\n"),
    clientEmail: serviceAccount.client_email,
  }),
});

module.exports = admin;
