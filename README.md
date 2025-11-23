# 🚀 Aplicación Web PHP con Docker Compose

Una aplicación web completa utilizando PHP, MariaDB y phpMyAdmin, todo orquestado con Docker Compose para un entorno de desarrollo profesional y portable.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Requisitos Previos](#-requisitos-previos)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación Rápida](#-instalación-rápida)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Servicios Disponibles](#-servicios-disponibles)
- [Comandos Útiles](#-comandos-útiles)
- [Desarrollo](#-desarrollo)
- [Solución de Problemas](#-solución-de-problemas)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

## ✨ Características

- **🐳 Docker Compose**: Configuración completa multi-contenedor
- **🐘 PHP 8.2**: Con Apache y extensiones necesarias preconfiguradas
- **🗄️ MariaDB 10.11**: Base de datos relacional robusta
- **📊 phpMyAdmin**: Interfaz gráfica para gestión de base de datos
- **🔄 Hot Reload**: Cambios en tiempo real sin reiniciar contenedores
- **🔒 Variables de Entorno**: Configuración segura con archivo `.env`
- **🌐 Red Aislada**: Comunicación segura entre contenedores
- **💾 Persistencia de Datos**: Volúmenes Docker para datos de BD
- **📦 Fácil Instalación**: Un comando para levantar todo el entorno

## 🔧 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- [Docker](https://www.docker.com/get-started) (versión 20.10 o superior)
- [Docker Compose](https://docs.docker.com/compose/install/) (versión 2.0 o superior)
- Git (opcional, para clonar el repositorio)

### Verificar Instalación

```bash
# Verificar Docker
docker --version

# Verificar Docker Compose
docker-compose --version
```

## 📁 Estructura del Proyecto

```
mi-proyecto/
│
├── docker-compose.yml      # Configuración de servicios Docker
├── .env                    # Variables de entorno (no compartir)
├── .env.example           # Plantilla de variables de entorno
├── README.md              # Este archivo
│
├── app/                   # Código fuente de la aplicación
│   ├── index.php         # Página principal
│   ├── db_config.php     # Configuración de base de datos
│   ├── css/
│   │   └── styles.css    # Estilos CSS
│   └── js/
│       └── script.js     # JavaScript frontend
│
└── docker/               # Configuraciones Docker
    ├── php/
    │   └── Dockerfile    # Imagen personalizada de PHP
    └── db/
        └── init.sql      # Script inicial de BD (opcional)
```

## 🚀 Instalación Rápida

### Opción 1: Clonar el Repositorio

```bash
# Clonar el proyecto
git clone https://github.com/tu-usuario/tu-proyecto.git
cd tu-proyecto

# Copiar archivo de variables de entorno
cp .env.example .env

# Iniciar los contenedores
docker-compose up -d
```

### Opción 2: Crear desde Cero

1. Crear la estructura de directorios:
```bash
mkdir -p mi-proyecto/{app/{css,js},docker/{php,db}}
cd mi-proyecto
```

2. Copiar los archivos del proyecto según la estructura mostrada

3. Crear archivo `.env`:
```bash
cat > .env << EOF
DB_ROOT_PASSWORD=root_secreto
DB_NAME=mi_aplicacion
DB_USER=developer
DB_PASSWORD=dev_password
EOF
```

4. Iniciar Docker Compose:
```bash
docker-compose up -d
```

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Base de Datos
DB_ROOT_PASSWORD=root_secreto    # Contraseña del usuario root de MariaDB
DB_NAME=mi_aplicacion            # Nombre de la base de datos
DB_USER=developer                # Usuario de la aplicación
DB_PASSWORD=dev_password         # Contraseña del usuario

# Puertos (opcional, agregar si necesitas cambiarlos)
WEB_PORT=8080                    # Puerto para la aplicación web
PMA_PORT=8081                    # Puerto para phpMyAdmin
DB_PORT=3306                     # Puerto para MariaDB
```

### Configuración de PHP

Para modificar la configuración de PHP, edita el archivo `docker/php/Dockerfile`:

```dockerfile
# Ejemplo: Aumentar límites de memoria
RUN echo "memory_limit = 256M" >> /usr/local/etc/php/conf.d/custom.ini
```

## 💻 Uso

### Acceder a los Servicios

Una vez que los contenedores estén en ejecución:

| Servicio | URL | Credenciales |
|----------|-----|--------------|
| **Aplicación Web** | http://localhost:8080 | - |
| **phpMyAdmin** | http://localhost:8081 | Usuario: `developer`<br>Contraseña: `dev_password` |
| **MariaDB** | localhost:3306 | Usuario: `developer`<br>Contraseña: `dev_password` |

### Estructura de URLs

- `http://localhost:8080` - Página principal (index.php)
- `http://localhost:8080/css/styles.css` - Archivo de estilos
- `http://localhost:8080/js/script.js` - JavaScript frontend

## 🐳 Servicios Disponibles

### 1. Web (PHP + Apache)
- **Imagen**: PHP 8.2 con Apache
- **Puerto**: 8080
- **Volumen**: `./app:/var/www/html`
- **Características**:
  - Extensiones PDO y MySQLi instaladas
  - mod_rewrite habilitado
  - Hot reload activado

### 2. Database (MariaDB)
- **Imagen**: MariaDB 10.11
- **Puerto**: 3306
- **Volumen**: Datos persistentes en `db_data`
- **Base de datos inicial**: `mi_aplicacion`

### 3. phpMyAdmin
- **Imagen**: phpMyAdmin última versión
- **Puerto**: 8081
- **Límite de subida**: 100MB
- **Conexión automática** a MariaDB

## 📝 Comandos Útiles

### Comandos Básicos

```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f web

# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (reset completo)
docker-compose down -v

# Reiniciar un servicio específico
docker-compose restart web
```

### Comandos de Desarrollo

```bash
# Ejecutar comandos en el contenedor PHP
docker-compose exec web bash

# Acceder a MySQL CLI
docker-compose exec database mysql -u developer -pdev_password mi_aplicacion

# Ver estado de los contenedores
docker-compose ps

# Reconstruir imágenes
docker-compose build --no-cache

# Ver uso de recursos
docker stats
```

### Backup y Restauración

```bash
# Backup de la base de datos
docker-compose exec database mysqldump -u root -proot_secreto mi_aplicacion > backup.sql

# Restaurar base de datos
docker-compose exec -T database mysql -u root -proot_secreto mi_aplicacion < backup.sql
```

## 🔧 Desarrollo

### Agregar Nuevas Páginas PHP

1. Crear archivo en `app/`:
```php
// app/nueva-pagina.php
<?php
require_once 'db_config.php';
// Tu código aquí
?>
```

2. Acceder en: `http://localhost:8080/nueva-pagina.php`

### Trabajar con la Base de Datos

Ejemplo de conexión PDO en PHP:

```php
<?php
try {
    $pdo = new PDO(
        "mysql:host=$db_host;dbname=$db_name;charset=utf8mb4",
        $db_user,
        $db_password,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    
    // Tu consulta aquí
    $stmt = $pdo->query("SELECT * FROM usuarios");
    $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
```

### Instalar Extensiones PHP Adicionales

Modifica `docker/php/Dockerfile`:

```dockerfile
# Ejemplo: Agregar GD para manipulación de imágenes
RUN apt-get update && apt-get install -y \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd
```

Luego reconstruye:
```bash
docker-compose build web
docker-compose up -d
```

## 🐛 Solución de Problemas

### Error: "Cannot connect to database"

1. Verificar que el contenedor de base de datos esté ejecutándose:
```bash
docker-compose ps
```

2. Revisar logs de MariaDB:
```bash
docker-compose logs database
```

3. Verificar variables de entorno en `.env`

### Error: "Permission denied"

Si hay problemas de permisos en Linux/Mac:

```bash
# Dar permisos al directorio app
sudo chown -R $USER:$USER app/

# O dentro del contenedor
docker-compose exec web chown -R www-data:www-data /var/www/html
```

### Puerto en uso

Si el puerto 8080 está ocupado:

1. Cambiar en `docker-compose.yml`:
```yaml
services:
  web:
    ports:
      - "8090:80"  # Cambiar 8080 por 8090
```

2. O detener el servicio que usa el puerto:
```bash
# En Linux/Mac
sudo lsof -i :8080
sudo kill -9 <PID>
```

### Resetear Todo

Para un inicio limpio:

```bash
# Detener y eliminar todo
docker-compose down -v
docker system prune -a

# Volver a construir
docker-compose build --no-cache
docker-compose up -d
```
