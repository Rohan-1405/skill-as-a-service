-- CREATE ALL DATABASES
CREATE DATABASE IF NOT EXISTS auth_db;
CREATE DATABASE IF NOT EXISTS profile_db;
CREATE DATABASE IF NOT EXISTS subscription_db;
CREATE DATABASE IF NOT EXISTS payment_db;
CREATE DATABASE IF NOT EXISTS wallet_db;
CREATE DATABASE IF NOT EXISTS project_db;
CREATE DATABASE IF NOT EXISTS chat_db;
CREATE DATABASE IF NOT EXISTS notification_db;
CREATE DATABASE IF NOT EXISTS cms_db;
CREATE DATABASE IF NOT EXISTS analytics_db;

-- GRANT PERMISSIONS
GRANT ALL PRIVILEGES ON auth_db.* TO 'fusion5user'@'%';
GRANT ALL PRIVILEGES ON profile_db.* TO 'fusion5user'@'%';
GRANT ALL PRIVILEGES ON subscription_db.* TO 'fusion5user'@'%';
GRANT ALL PRIVILEGES ON payment_db.* TO 'fusion5user'@'%';
GRANT ALL PRIVILEGES ON wallet_db.* TO 'fusion5user'@'%';
GRANT ALL PRIVILEGES ON project_db.* TO 'fusion5user'@'%';
GRANT ALL PRIVILEGES ON chat_db.* TO 'fusion5user'@'%';
GRANT ALL PRIVILEGES ON notification_db.* TO 'fusion5user'@'%';
GRANT ALL PRIVILEGES ON cms_db.* TO 'fusion5user'@'%';
GRANT ALL PRIVILEGES ON analytics_db.* TO 'fusion5user'@'%';
FLUSH PRIVILEGES;

-- AUTH_DB TABLES
USE auth_db;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    uuid VARCHAR(100) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mobile VARCHAR(20),
    password VARCHAR(255),
    profile_image VARCHAR(500),
    status ENUM('ACTIVE','INACTIVE','SUSPENDED','BLOCKED') DEFAULT 'INACTIVE',
    email_verified BOOLEAN DEFAULT FALSE,
    two_fa_enabled BOOLEAN DEFAULT FALSE,
    two_fa_secret VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX IDX_USERS_EMAIL (email),
    INDEX IDX_USERS_MOBILE (mobile),
    INDEX IDX_USERS_STATUS (status)
);

CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE IF NOT EXISTS permissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    permission_name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS user_roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_role (user_id, role_id)
);

CREATE TABLE IF NOT EXISTS password_resets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS social_accounts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    provider ENUM('GOOGLE','FACEBOOK','GITHUB') NOT NULL,
    provider_user_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_provider (provider, provider_user_id)
);

-- SEED ROLES
INSERT IGNORE INTO roles (role_name, description) VALUES
('SUPER_ADMIN', 'Full platform access'),
('ADMIN', 'Operations management'),
('FREELANCER', 'Service provider'),
('CLIENT', 'Service consumer');