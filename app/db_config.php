<?php
// Configuración de base de datos usando variables de entorno
$db_host = $_ENV['DB_HOST'] ?? 'database';
$db_name = $_ENV['DB_NAME'] ?? 'mi_aplicacion';
$db_user = $_ENV['DB_USER'] ?? 'developer';
$db_password = $_ENV['DB_PASSWORD'] ?? 'dev_password';

// Configuración para mostrar errores en desarrollo
error_reporting(E_ALL);
ini_set('display_errors', 1);
