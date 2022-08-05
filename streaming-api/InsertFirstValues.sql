-- CREAR ROLES
INSERT INTO streamingDB.Rol (name) VALUES('Administrador');
INSERT INTO streamingDB.Rol (name) VALUES('Usuario');

-- CREAR USUARIO ADMINISTRADOR
INSERT INTO streamingDB.`User`
(name, lastname, email, password, document, rolId, created_at, updated_at)
VALUES('Administrator', 'Admin', 'admin@stream.com', 'Admin1234*', '1214725814', 
(SELECT id FROM streamingDB.Rol WHERE name = 'Administrador'),
CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));

