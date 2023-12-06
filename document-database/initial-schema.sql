DROP DATABASE IF EXISTS "university";    
DROP DATABASE IF EXISTS "postgres";    
DROP DATABASE IF EXISTS "document-database";    

CREATE DATABASE "document-database";

CREATE SCHEMA business;

CREATE TABLE documents (
   id SERIAL PRIMARY KEY,
   name VARCHAR(255) NOT NULL,
   uploader_ip VARCHAR(255) NOT NULL,
   size INT  NOT NULL
);

CREATE TABLE users (
   id SERIAL PRIMARY KEY,
   name VARCHAR(255) NOT NULL,
   last_access_ip VARCHAR(255) NOT NULL,
   size INT  NOT NULL
);

