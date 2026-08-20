const bcrypt = require('bcrypt');

async function testHashing() {
    const myPlaintextPassword = 'mySecretPassword';
    const saltRounds = 10;
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(myPlaintextPassword, saltRounds);
    console.log('Hashed Password:', hashedPassword);

    // compare the correct password against the hash

    const isMatch = await bcrypt.compare(myPlaintextPassword, hashedPassword);
    console.log('Password match:', isMatch); // Should print: true
    
    // compare an incorrect password against the hash
    const isMatchIncorrect = await bcrypt.compare('wrongPassword', hashedPassword);
    console.log('Incorrect password match:', isMatchIncorrect); // Should print: false

}

testHashing().catch(console.error);