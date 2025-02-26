const { getUsersCollection } = require('../db');

const getUserById = async (userId) => {
    const users = await getUsersCollection();
    return await users.findOne({ _id: userId });
};

const updateUser = async (userId, updates) => {
    const users = await getUsersCollection();
    return await users.updateOne({ _id: userId }, { $set: updates });
};

module.exports = { getUserById, updateUser };