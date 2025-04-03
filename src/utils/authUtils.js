const bcryptjs = require("bcryptjs");

const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcryptjs.hash(password, saltRounds);
};

const comparePassword = async (password, hashedPassword) => {
    return await bcryptjs.compare(password, hashedPassword);
};

module.exports = { hashPassword, comparePassword };
