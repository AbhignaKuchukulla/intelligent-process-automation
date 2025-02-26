const { getUsersCollection } = require('../config/db');

const getUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const users = await getUsersCollection();
        const user = await users.findOne({ _id: userId });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Get User Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateUserDetails = async (req, res) => {
    try {
        const { userId } = req.params;
        const updates = req.body;
        const users = await getUsersCollection();

        await users.updateOne({ _id: userId }, { $set: updates });
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Update User Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { getUser, updateUserDetails };
