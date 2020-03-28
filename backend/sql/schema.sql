DO
$do$
BEGIN
   IF EXISTS (SELECT FROM pg_database WHERE datname = 'postgres') THEN
      RAISE NOTICE 'Database already exists';  -- optional
   ELSE
      PERFORM dblink_exec('dbname=' || current_database()  -- current db
                        , 'CREATE DATABASE postgres');
   END IF;
END
$do$;

ALTER ROLE postgres SET client_encoding TO 'utf8';
ALTER ROLE postgres SET default_transaction_isolation TO 'read committed';
ALTER ROLE postgres SET timezone TO 'America/New_York';
GRANT ALL PRIVILEGES ON DATABASE postgres TO postgres;

CREATE SEQUENCE user_id_seq;

CREATE TABLE users (
        id integer NOT NULL DEFAULT nextval('user_id_seq'),
        username varchar(30) NOT NULL UNIQUE,
        first_name varchar(30) NOT NULL,
        last_name varchar(30) NOT NULL,
        email varchar(75) NOT NULL,
        bio varchar(2048),
        password varchar(128) NOT NULL,
        is_staff BOOLEAN NOT NULL,
        is_active BOOLEAN NOT NULL,
        is_superuser BOOLEAN NOT NULL,
        last_login date NOT NULL,
        date_joined date NOT NULL
    );


CREATE SEQUENCE contact_id_seq;

CREATE TABLE contacts (
        id integer NOT NULL DEFAULT nextval('contact_id_seq'),
        username varchar(30) NOT NULL UNIQUE,
        first_name varchar(30) NOT NULL,
        last_name varchar(30) NOT NULL,
        email varchar(75) NOT NULL,
        phone varchar(30) NOT NULL
    );

CREATE SEQUENCE state_id_seq;

CREATE TABLE states (
        id integer NOT NULL DEFAULT nextval('state_id_seq'),
        name varchar(256) NOT NULL UNIQUE,
        code varchar(10) NOT NULL UNIQUE
    );


CREATE SEQUENCE site_id_seq;

CREATE TABLE sites (
        id integer NOT NULL DEFAULT nextval('site_id_seq'),
        host varchar(2048),
        port integer,
        ip varchar(256),
        date_last_crawled date NOT NULL,
        UNIQUE(id)
   );


CREATE SEQUENCE page_id_seq;
 
CREATE TABLE pages (
        id integer NOT NULL DEFAULT nextval('page_id_seq'),
        name varchar(2048),
        meta varchar(2048),
        headers varchar(2048),
        site_id integer,
        FOREIGN KEY(site_id) REFERENCES sites(id) ON DELETE CASCADE,
        UNIQUE(id)        
    );

CREATE SEQUENCE form_id_seq;

CREATE TABLE forms (
        id integer NOT NULL DEFAULT nextval('form_id_seq'),
        action varchar(2048),
        form_id varchar(256),
        name varchar(256),
        method varchar(256),
        body varchar(2256),
        page_id integer NOT NULL,
        FOREIGN KEY(page_id) REFERENCES pages(id) ON DELETE CASCADE,
        UNIQUE(id)
    );

CREATE SEQUENCE formfield_id_seq;

CREATE TABLE formfields (
        id integer NOT NULL DEFAULT nextval('formfield_id_seq'),
        field_id varchar(256),
        field_name varchar(256),
        field_value varchar(256),
        field_tyle varchar(256),
        field_placeholder varchar(256),
        form_id integer NOT NULL,
        FOREIGN KEY(form_id) REFERENCES forms(id) ON DELETE CASCADE,
        UNIQUE(id)
    );

ALTER SEQUENCE formfield_id_seq 
OWNED BY formfields.id;

ALTER SEQUENCE form_id_seq 
OWNED BY forms.id;

ALTER SEQUENCE page_id_seq 
OWNED BY pages.id;

ALTER SEQUENCE site_id_seq 
OWNED BY sites.id;

ALTER SEQUENCE user_id_seq
OWNED BY users.id;

ALTER SEQUENCE state_id_seq
OWNED BY states.id;

ALTER SEQUENCE contact_id_seq
OWNED BY contacts.id;

