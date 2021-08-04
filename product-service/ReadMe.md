--CREATE TABLE stocks (
--    id        uuid,
--    count     int,
--
--CONSTRAINT fkProduct
--      FOREIGN KEY(id)
--      REFERENCES products(id)
--      ON DELETE CASCADE
--);

--DROP TABLE IF EXISTS products;

--CREATE TABLE products (
--    id                uuid DEFAULT uuid_generate_v4 (),
--    title             text NOT NULL,
--    description       text,
--    price             int,
--    PRIMARY KEY(id)
--);

--INSERT INTO products(title, description, price)
--VALUES
--    ('iPhone 8', 'iPhone 8', 500),
--    ('iPhone 10', 'iPhone 10', 600),
--    ('iPhone 11', 'iPhone 11', 700),
--    ('iPhone 12', 'iPhone 12', 1500),
--    ('iPhone 12mini', 'iPhone 12mini', 1550),
--    ('iPhone 12pro', 'iPhone 12pro', 1600),
--    ('iPhone 5s', 'iPhone 5s', 200),
--    ('iPhone 4s', 'iPhone 4s', 100);

--INSERT INTO stocks(id, count)
--VALUES
--    ('517a943b-985d-4fc7-8e0c-b9268307a745', 4),
--    ('42456291-e8e2-49dd-9644-66a53e02f51c', 6),
--    ('fcf85bd8-04c6-444b-ae40-fb9e23624d85', 7),
--    ('5d3b5b12-1229-48d2-967f-deae85c027c6', 12),
--    ('289b8052-662f-400b-95d1-f15c83a49545', 7),
--    ('f153c8a4-1978-4ef7-b6b1-5dcc1fb7f3cc', 8),
--    ('5d47b3dd-51a6-4bb8-bf64-a6ed0a315120', 2),
--    ('f2c5fad3-8e58-4a04-b4a2-cafead28cecd', 3);


--select * from pg_extension;

--select * from pg_available_extensions;

--CREATE EXTENSION "uuid-ossp";

--CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
