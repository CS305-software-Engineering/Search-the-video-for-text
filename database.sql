DROP TABLE IF EXISTS search_history;
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS
    users(
        id VARCHAR(256) PRIMARY KEY,
        email VARCHAR(256) NOT NULL UNIQUE,
        password VARCHAR(256) NOT NULL,
        created_date TIMESTAMP,
        modified_date TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS
    search_history(
        id VARCHAR(256),
        date_created TIMESTAMP,
        video_link VARCHAR(256) NOT NULL,
        search_text VARCHAR(256) NOT NULL,
        transcribed_text VARCHAR(10240) NOT NULL,
        PRIMARY KEY(id, date_created, video_link),
        FOREIGN KEY(id) REFERENCES users(id) ON DELETE CASCADE
    );