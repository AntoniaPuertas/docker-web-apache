# Explicación detallada del Dockerfile

Este Dockerfile crea una imagen personalizada de PHP con Apache, configurada específicamente para tu aplicación web. Te explico línea por línea:

---

## Imagen base

```dockerfile
FROM php:8.2-apache
```

- **FROM**: Define la imagen base sobre la que se construirá tu imagen personalizada
- **php:8.2-apache**: Imagen oficial de PHP versión 8.2 que ya incluye:
  - PHP 8.2 instalado y configurado
  - Servidor web Apache2
  - Sistema operativo Debian (generalmente)
- Esta es una imagen "todo en uno" que combina PHP y Apache, ideal para aplicaciones web

---

## Instalación de extensiones PHP

```dockerfile
RUN docker-php-ext-install mysqli pdo pdo_mysql
```

- **RUN**: Ejecuta comandos durante la construcción de la imagen
- **docker-php-ext-install**: Comando especial proporcionado por las imágenes oficiales de PHP para instalar extensiones
- **mysqli**: Extensión MySQL mejorada (MySQL Improved)
  - API procedural y orientada a objetos para conectarse a MySQL/MariaDB
  - Versión moderna de la antigua extensión `mysql`
- **pdo**: PHP Data Objects
  - Capa de abstracción para acceso a bases de datos
  - Proporciona una interfaz consistente para diferentes sistemas de BD
- **pdo_mysql**: Driver PDO específico para MySQL/MariaDB
  - Permite usar PDO con bases de datos MySQL/MariaDB
  - Utilizado en tu `index.php` para la conexión

**¿Por qué instalar estas extensiones?**
- No vienen incluidas por defecto en la imagen base
- Son necesarias para que PHP pueda comunicarse con MariaDB
- Tu aplicación las utiliza en `db_config.php` e `index.php`

---

## Habilitación de módulos de Apache

```dockerfile
RUN a2enmod rewrite
```

- **a2enmod**: Comando de Apache para habilitar módulos
- **rewrite**: Módulo `mod_rewrite` de Apache
  - Permite reescribir URLs sobre la marcha
  - Fundamental para URLs amigables (ej: `/productos/zapatos` en lugar de `/index.php?categoria=zapatos`)
  - Necesario para frameworks modernos de PHP (Laravel, Symfony, etc.)
  - Permite usar archivos `.htaccess` para reglas de reescritura

---

## Configuración del directorio de trabajo

```dockerfile
WORKDIR /var/www/html
```

- **WORKDIR**: Establece el directorio de trabajo dentro del contenedor
- **/var/www/html**: Directorio por defecto donde Apache busca los archivos web
- Todos los comandos posteriores se ejecutarán desde este directorio
- Es donde se montará tu carpeta `./app` mediante el volumen en `docker-compose.yml`

---

## Ajuste de permisos

```dockerfile
RUN chown -R www-data:www-data /var/www/html
```

- **chown**: Comando Linux para cambiar el propietario de archivos/directorios
- **-R**: Recursivo (aplica a todos los archivos y subcarpetas)
- **www-data:www-data**: 
  - Primer `www-data`: Usuario propietario
  - Segundo `www-data`: Grupo propietario
  - `www-data` es el usuario bajo el cual se ejecuta Apache por defecto
- **¿Por qué es necesario?**
  - Apache necesita permisos para leer y ejecutar los archivos PHP
  - Previene errores de permisos denegados
  - Permite que Apache escriba archivos si es necesario (logs, caché, uploads)

---

## Configuración PHP personalizada

```dockerfile
RUN echo "upload_max_filesize = 50M" >> /usr/local/etc/php/conf.d/uploads.ini && \
    echo "post_max_size = 50M" >> /usr/local/etc/php/conf.d/uploads.ini
```

Esta línea hace dos cosas mediante el operador `&&`:

### Primera parte:
```dockerfile
echo "upload_max_filesize = 50M" >> /usr/local/etc/php/conf.d/uploads.ini
```
- **echo**: Imprime texto
- **>>**: Operador de redirección que añade (append) al final del archivo
- **upload_max_filesize = 50M**: Configuración PHP que limita el tamaño máximo de archivos que se pueden subir
- **/usr/local/etc/php/conf.d/**: Directorio donde PHP lee configuraciones personalizadas
- **uploads.ini**: Archivo personalizado que se crea (si no existe) con esta configuración

### Segunda parte:
```dockerfile
echo "post_max_size = 50M" >> /usr/local/etc/php/conf.d/uploads.ini
```
- **post_max_size = 50M**: Tamaño máximo de datos POST que PHP aceptará
- Debe ser igual o mayor que `upload_max_filesize`
- Incluye no solo archivos, sino todos los datos del formulario

**¿Por qué modificar estos valores?**
- Los valores por defecto de PHP son muy bajos (2MB típicamente)
- Aumentarlos a 50MB permite subir archivos más grandes
- Útil para aplicaciones que manejan imágenes, documentos o archivos multimedia

---

## Resumen del flujo de construcción

Cuando ejecutas `docker-compose up --build`, Docker:

1. **Descarga** la imagen base `php:8.2-apache`
2. **Instala** las extensiones de MySQL necesarias
3. **Habilita** el módulo de reescritura de Apache
4. **Configura** el directorio de trabajo
5. **Ajusta** los permisos para el usuario de Apache
6. **Personaliza** las configuraciones de PHP para uploads
7. **Guarda** la imagen resultante para uso futuro

---

## Arquitectura resultante

```
┌─────────────────────────────────────┐
│     Contenedor PHP-Apache           │
│                                     │
│  ┌──────────────────────────────┐  │
│  │   Apache (Puerto 80)         │  │
│  │   - mod_rewrite habilitado   │  │
│  └──────────────────────────────┘  │
│              ↓                      │
│  ┌──────────────────────────────┐  │
│  │   PHP 8.2                    │  │
│  │   - mysqli                   │  │
│  │   - pdo                      │  │
│  │   - pdo_mysql                │  │
│  │   - upload: 50MB             │  │
│  └──────────────────────────────┘  │
│              ↓                      │
│  ┌──────────────────────────────┐  │
│  │   /var/www/html              │  │
│  │   (tu código PHP)            │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
```

Este Dockerfile crea un entorno completo y optimizado para ejecutar aplicaciones PHP con acceso a bases de datos MySQL/MariaDB.
