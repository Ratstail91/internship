CREATE TABLE mailinglist (
	email VARCHAR(30),
	fname VARCHAR(20),
	lname VARCHAR(20),
	birthdate DATE,
	income FLOAT,
	timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
