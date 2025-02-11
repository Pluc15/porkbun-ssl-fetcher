const axios = require("axios");
const process = require("process");
const fs = require("fs/promises");

const { DOMAIN, PORKBUN_API_KEY, PORKBUN_SECRET_KEY } = process.env;

if (!DOMAIN) throw new Error("Missing DOMAIN env variable.");
if (!PORKBUN_API_KEY) throw new Error("Missing PORKBUN_API_KEY env variable.");
if (!PORKBUN_SECRET_KEY) throw new Error("Missing PORKBUN_SECRET_KEY env variable.");

async function updateCertificates() {
  console.log(`[${new Date().toISOString()}] Updating certificates for ${DOMAIN}.`);

  const response = await axios.default.post(
    `https://api.porkbun.com/api/json/v3/ssl/retrieve/${DOMAIN}`,
    {
      apikey: PORKBUN_API_KEY,
      secretapikey: PORKBUN_SECRET_KEY,
    },
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  const { certificatechain, privatekey, publickey } = response.data;

  await fs.writeFile(`/certificates/${DOMAIN}.chain.cert.pem`, certificatechain);
  await fs.writeFile(`/certificates/${DOMAIN}.private.key.pem`, privatekey);
  await fs.writeFile(`/certificates/${DOMAIN}.public.key.pem`, publickey);

  console.log(`[${new Date().toISOString()}] Certificates for ${DOMAIN} updated.`);
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function main() {
  await updateCertificates();
  console.log(`[${new Date().toISOString()}] Sleeping for a day before updating certificates again.`);
  await sleep(24 * 60 * 60 * 1000);
}

main();
