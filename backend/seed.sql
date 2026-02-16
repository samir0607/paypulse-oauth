-- Seed test company for OAuth integration testing
-- Run this if npm run seed doesn't work

INSERT INTO company_table (name, industry, numberOfEmployees, website, currency, headLocation) 
VALUES ('Test Company', 'Technology', 100, 'https://example.com', 'USD', 'USA');
