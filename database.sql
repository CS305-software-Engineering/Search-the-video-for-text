DROP TABLE IF EXISTS search_history;
DROP TABLE IF EXISTS user_history;
-- DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS
    users(
        id VARCHAR(256) PRIMARY KEY,
        email VARCHAR(256) NOT NULL UNIQUE,
        password VARCHAR(256) NOT NULL,
        created_date TIMESTAMP,
        modified_date TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS
    user_history(
		video_id VARCHAR(256) NOT NULL,
        user_id VARCHAR(256) NOT NULL,
        sub_id VARCHAR(256) NOT NULL,
		date_created TIMESTAMP,
        PRIMARY KEY(video_id),
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
CREATE TABLE IF NOT EXISTS
    search_history(
		id VARCHAR(256) PRIMARY KEY,
        video_id VARCHAR(256),
        search_text VARCHAR(256) NOT NULL,
		date_created TIMESTAMP,
        FOREIGN KEY(video_id) REFERENCES user_history(video_id) ON DELETE CASCADE
    );