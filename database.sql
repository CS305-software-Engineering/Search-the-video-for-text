DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS
    users(
        id VARCHAR(256) PRIMARY KEY,
        email VARCHAR(256) NOT NULL UNIQUE,
        password VARCHAR(256) NOT NULL,
        created_date TIMESTAMP,
        modified_date TIMESTAMP
    );
	
SELECT * from users;