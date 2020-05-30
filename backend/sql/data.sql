INSERT INTO users (username, password, category, email, first_name, last_name, is_staff, is_active, is_superuser, last_login, date_joined) VALUES('Machiavelli', 'covid1919', 'admin', 'alfonso@gmail.com', 'Nicollo', 'Machiavelli', TRUE, TRUE, TRUE, NOW(), NOW());
INSERT INTO users (username, password, category, email, first_name, last_name, is_staff, is_active, is_superuser, last_login, date_joined) VALUES('Dmitryro', 'covid1919', 'admin', 'petro@gmail.com', 'Dmitry', 'Roitman', TRUE, TRUE, TRUE, NOW(), NOW());
INSERT INTO logtypes(code, type) VALUES ('AL', 'ACTION LOG');
INSERT INTO logtypes(code, type) VALUES ('CL', 'CHAIN LOG');
INSERT INTO logtypes(code, type) VALUES ('FL', 'FORM LOG');
INSERT INTO logtypes(code, type) VALUES ('EL', 'EVENT LOG');
INSERT INTO sites(host, port, ip, ga, date_added, date_last_crawled) VALUES('heap.io', '8080', '127.0.0.1', 'UI-201031', NOW(), NOW());
INSERT INTO sites(host, port, ip, ga, date_added, date_last_crawled) VALUES('3dact.com', '8080', '127.0.0.1', 'UI-201032', NOW(), NOW());
INSERT INTO pages(name, meta, headers, site_id) VALUES('home', 'meta', 'headers', 1);
INSERT INTO pages(name, meta, headers, site_id) VALUES('blog', 'meta', 'headers', 1);
INSERT INTO forms(action, form_id, name, method, page_id, action_id) VALUES('/send', 'sampleform', 'sampleform', 'POST', 1, 1);
INSERT INTO formfields(field_id, field_name, field_value, field_type, field_placeholder, form_id, action_id) VALUES('bio', 'bio', '','text', 'Initial Text',1, 1);
INSERT INTO formfields(field_id, field_name, field_value, field_type, field_placeholder, form_id, action_id) VALUES('email', 'email', '', 'text', 'Initial Text', 1, 1);
INSERT INTO formfields(field_id, field_name, field_value, field_type, field_placeholder, form_id, action_id) VALUES('username', 'username', '', 'text', 'Initial Text', 1, 1);
INSERT INTO formfields(field_id, field_name, field_value, field_type, field_placeholder, form_id, action_id) VALUES('firstname', 'firstname', '', 'text', 'Initial Text', 1, 1);
INSERT INTO formfields(field_id, field_name, field_value, field_type, field_placeholder, form_id, action_id) VALUES('lastname', 'lastname', '', 'text', 'Initial Text', 1, 1);
INSERT INTO actions (is_running, profile_key, name, last_run) VALUES (FALSE, 'GX-20101', 'scan', NOW());
INSERT INTO actions (is_running, profile_key, name, last_run) VALUES (TRUE, 'GX-20102', 'monitor', NOW());
INSERT INTO rules (name, code, is_active, severety) VALUES('detect', 'WORD test', TRUE, 'medium');
INSERT INTO rules (name, code, is_active, severety) VALUES('detect', 'WORD murder', TRUE, 'high');
INSERT INTO rules (name, code, is_active, severety) VALUES('block', 'WORD kill', TRUE, 'high');
INSERT INTO action_rule_link(action_id, rule_id) VALUES(1, 1);
INSERT INTO action_rule_link(action_id, rule_id) VALUES(1, 2);
INSERT INTO action_rule_link(action_id, rule_id) VALUES(2, 1);
INSERT INTO action_rule_link(action_id, rule_id) VALUES(2, 2);
INSERT INTO action_rule_link(action_id, rule_id) VALUES(2, 3);
INSERT INTO action_form_link(action_id, form_id) VALUES(1, 1);
INSERT INTO action_form_link(action_id, form_id) VALUES(2, 1);
INSERT INTO action_formfield_link(action_id, formfield_id) VALUES(1, 1);
INSERT INTO action_formfield_link(action_id, formfield_id) VALUES(1, 2);
INSERT INTO action_formfield_link(action_id, formfield_id) VALUES(1, 3);
INSERT INTO action_formfield_link(action_id, formfield_id) VALUES(2, 4);
INSERT INTO action_formfield_link(action_id, formfield_id) VALUES(2, 5);
INSERT INTO action_formfield_link(action_id, formfield_id) VALUES(2, 3);
INSERT INTO form_formfield_link(form_id, formfield_id) VALUES(1, 1);
INSERT INTO form_formfield_link(form_id, formfield_id) VALUES(1, 2);
INSERT INTO form_formfield_link(form_id, formfield_id) VALUES(1, 3);
INSERT INTO states (code, name) VALUES ('AL', 'Alabama');
INSERT INTO states (code, name) VALUES ('AK', 'Alaska');
INSERT INTO states (code, name) VALUES ('AZ', 'Arizona');
INSERT INTO states (code, name) VALUES ('AR', 'Arkansas');
INSERT INTO states (code, name) VALUES ('CA', 'California');
INSERT INTO states (code, name) VALUES ('CO', 'Colorado');
INSERT INTO states (code, name) VALUES ('CT', 'Connecticut');
INSERT INTO states (code, name) VALUES ('DE', 'Delaware');
INSERT INTO states (code, name) VALUES ('DC', 'District of Columbia');
INSERT INTO states (code, name) VALUES ('FL', 'Florida');
INSERT INTO states (code, name) VALUES ('GA', 'Georgia');
INSERT INTO states (code, name) VALUES ('HI', 'Hawaii');
INSERT INTO states (code, name) VALUES ('ID', 'Idaho');
INSERT INTO states (code, name) VALUES ('IL', 'Illinois');
INSERT INTO states (code, name) VALUES ('IN', 'Indiana');
INSERT INTO states (code, name) VALUES ('IA', 'Iowa');
INSERT INTO states (code, name) VALUES ('KS', 'Kansas');
INSERT INTO states (code, name) VALUES ('KY', 'Kentucky');
INSERT INTO states (code, name) VALUES ('LA', 'Louisiana');
INSERT INTO states (code, name) VALUES ('ME', 'Maine');
INSERT INTO states (code, name) VALUES ('MD', 'Maryland');
INSERT INTO states (code, name) VALUES ('MA', 'Massachusetts');
INSERT INTO states (code, name) VALUES ('MI', 'Michigan');
INSERT INTO states (code, name) VALUES ('MN', 'Minnesota');
INSERT INTO states (code, name) VALUES ('MS', 'Mississippi');
INSERT INTO states (code, name) VALUES ('MO', 'Missouri');
INSERT INTO states (code, name) VALUES ('MT', 'Montana');
INSERT INTO states (code, name) VALUES ('NE', 'Nebraska');
INSERT INTO states (code, name) VALUES ('NV', 'Nevada');
INSERT INTO states (code, name) VALUES ('NH', 'New Hampshire');
INSERT INTO states (code, name) VALUES ('NJ', 'New Jersey');
INSERT INTO states (code, name) VALUES ('NM', 'New Mexico');
INSERT INTO states (code, name) VALUES ('NY', 'New York');
INSERT INTO states (code, name) VALUES ('NC', 'North Carolina');
INSERT INTO states (code, name) VALUES ('ND', 'North Dakota');
INSERT INTO states (code, name) VALUES ('OH', 'Ohio');
INSERT INTO states (code, name) VALUES ('OK', 'Oklahoma');
INSERT INTO states (code, name) VALUES ('OR', 'Oregon');
INSERT INTO states (code, name) VALUES ('PA', 'Pennsylvania');
INSERT INTO states (code, name) VALUES ('PR', 'Puerto Rico');
INSERT INTO states (code, name) VALUES ('RI', 'Rhode Island');
INSERT INTO states (code, name) VALUES ('SC', 'South Carolina');
INSERT INTO states (code, name) VALUES ('SD', 'South Dakota');
INSERT INTO states (code, name) VALUES ('TN', 'Tennessee');
INSERT INTO states (code, name) VALUES ('TX', 'Texas');
INSERT INTO states (code, name) VALUES ('UT', 'Utah');
INSERT INTO states (code, name) VALUES ('VT', 'Vermont');
INSERT INTO states (code, name) VALUES ('VA', 'Virginia');
INSERT INTO states (code, name) VALUES ('WA', 'Washington');
INSERT INTO states (code, name) VALUES ('WV', 'West Virginia');
INSERT INTO states (code, name) VALUES ('WI', 'Wisconsin');
INSERT INTO states (code, name) VALUES ('WY', 'Wyoming');
INSERT INTO states (code, name) VALUES ('GU', 'Guam');
INSERT INTO states (code, name) VALUES ('AB', 'Alberta');
INSERT INTO states (code, name) VALUES ('BC', 'British Columbia');
INSERT INTO states (code, name) VALUES ('MB', 'Manitoba');
INSERT INTO states (code, name) VALUES ('NB', 'New Brunswick');
INSERT INTO states (code, name) VALUES ('NL', 'Newfoundland and Labrador');
INSERT INTO states (code, name) VALUES ('NT', 'Northwest Territories');
INSERT INTO states (code, name) VALUES ('NS', 'Nova Scotia');
INSERT INTO states (code, name) VALUES ('NU', 'Nunavut');
INSERT INTO states (code, name) VALUES ('ON', 'Ontario');
INSERT INTO states (code, name) VALUES ('PE', 'Prince Edward Island');
INSERT INTO states (code, name) VALUES ('QC', 'Québec');
INSERT INTO states (code, name) VALUES ('SK', 'Saskatchewan');
INSERT INTO states (code, name) VALUES ('YT', 'Yukon Territory');
