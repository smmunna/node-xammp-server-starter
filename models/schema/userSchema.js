const usersSchema = {
    user_id: 'INT AUTO_INCREMENT PRIMARY KEY',
    username: 'VARCHAR(255) NULL',
    password: 'VARCHAR(255) NULL',
    email: 'VARCHAR(255) NULL',
    photo: 'VARCHAR(255) NULL',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
};

module.exports = {
    usersSchema,
};