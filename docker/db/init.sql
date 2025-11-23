CREATE TABLE
IF NOT EXISTS usuarios
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR
(100) NOT NULL,
    email VARCHAR
(100) UNIQUE NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO usuarios
    (nombre, email)
VALUES
    ('Juan Pérez', 'juan@example.com'),
    ('María García', 'maria@example.com'),
    ('Carlos López', 'carlos@example.com');