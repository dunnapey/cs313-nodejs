CREATE TABLE users
(
    id SERIAL UNIQUE
    , fname VARCHAR(50) NOT NULL
    , lname VARCHAR(50) NOT NULL
    , uname VARCHAR(50) UNIQUE NOT NULL
    , pwd VARCHAR(50) NOT NULL
    , email VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE channels
(
    id SERIAL UNIQUE
    , joinCode INTEGER UNIQUE NOT NULL
);

CREATE TABLE messages
(
    id SERIAL UNIQUE
    , author INTEGER NOT NULL REFERENCES users(id)
    , origin INTEGER NOT NULL REFERENCES channels(id)
    , content VARCHAR(10000) NOT NULL
    , postTime timestamptz NOT NULL DEFAULT now()::timestamptz
    , threadParent INTEGER REFERENCES messages(id)
);

/*
* TO CONVERT TO LOCAL TIME:
* timezone('MST', timestamptz) -- replace MST with timezone of any locale
* or
* SELECT postTime at time zone 'UTC' at time zone 'MST' FROM messages;
*/

-- INSERT DUMMY ROWS
INSERT INTO users (fname, lname, uname, pwd, email) VALUES
('fname1', 'lname1', 'uname1', 'pwd1', 'email1@gmail.com'),
('fname2', 'lname2', 'uname2', 'pwd2', 'email2@gmail.com'),
('fname3', 'lname3', 'uname3', 'pwd3', 'email3@gmail.com'),
('fname4', 'lname4', 'uname4', 'pwd4', 'email4@gmail.com'),
('fname5', 'lname5', 'uname5', 'pwd5', 'email5@gmail.com');

INSERT INTO channels (joinCode) VALUES
(floor(random()*9999+1000)::int),
(floor(random()*9999+1000)::int),
(floor(random()*9999+1000)::int),
(floor(random()*9999+1000)::int),
(floor(random()*9999+1000)::int);

INSERT INTO messages (author, origin, content, threadParent) VALUES
(1, 1, e'This is author 1\'s post in channel 1!!!'),
(2, 1, e'This is author 2\'s reply to author 1\'s post in channel 1!!!', 1);
