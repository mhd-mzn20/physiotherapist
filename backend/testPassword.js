const bcrypt = require('bcrypt');

async function testPassword() {
  const inputPassword = 'Khalil'; // The password you enter
  const storedHash = '$2b$10$lE6';  // The hashed password from your DB

  try {
    const match = await bcrypt.compare(inputPassword, storedHash);
    if (match) {
      console.log('✅ Password match!');
    } else {
      console.log('❌ Password does NOT match');
    }
  } catch (err) {
    console.error('Error comparing password:', err);
  }
}

testPassword();
