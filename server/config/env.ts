const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error(
    "❌ ADMIN_EMAIL or ADMIN_PASSWORD is missing in .env"
  );

  process.exit(1);
}

if (!JWT_SECRET) {
  console.error(
    "❌ JWT_SECRET is missing in .env"
  );

  process.exit(1);
}

module.exports = {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  JWT_SECRET,
};

export {};