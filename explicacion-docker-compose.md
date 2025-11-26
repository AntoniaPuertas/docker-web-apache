# Explicación detallada del archivo docker-compose.yml

Este archivo define una aplicación web completa con tres servicios interconectados. Te explico cada sección:

## Estructura general

```yaml
version: '3.8'
```
Especifica la versión de la sintaxis de Docker Compose que se utiliza.

---

## Servicio 1: Web (PHP + Apache)

```yaml
web:
  build:
    context: .
    dockerfile: docker/php/Dockerfile
```
- **build**: En lugar de usar una imagen preexistente, construye una imagen personalizada
- **context**: Usa el directorio actual (`.`) como contexto de construcción
- **dockerfile**: Ubicación del Dockerfile personalizado con PHP 8.2 y Apache

```yaml
  container_name: php-apache
  ports:
    - "8080:80"
```
- Nombra el contenedor como `php-apache`
- Mapea el puerto 80 del contenedor al puerto 8080 de tu máquina (accedes con `http://localhost:8080`)

```yaml
  volumes:
    - ./app:/var/www/html
```
- Monta la carpeta local `./app` dentro del contenedor en `/var/www/html`
- Permite editar código en tu máquina y verlo reflejado inmediatamente sin reconstruir la imagen

```yaml
  depends_on:
    - database
```
- Indica que este servicio depende del servicio `database`
- Docker iniciará primero la base de datos antes que el servidor web

```yaml
  environment:
    - DB_HOST=database
    - DB_NAME=${DB_NAME}
    - DB_USER=${DB_USER}
    - DB_PASSWORD=${DB_PASSWORD}
```
- Variables de entorno disponibles dentro del contenedor PHP
- Las variables con `${}` toman valores del archivo `.env`
- `DB_HOST=database` usa el nombre del servicio como hostname (resolución DNS interna de Docker)

---

## Servicio 2: Database (MariaDB)

```yaml
database:
  image: mariadb:10.11
```
- Usa la imagen oficial de MariaDB versión 10.11 desde Docker Hub

```yaml
  container_name: mariadb
  ports:
    - "3306:3306"
```
- Expone el puerto estándar de MySQL/MariaDB
- Permite conexiones desde tu máquina local con herramientas como MySQL Workbench

```yaml
  environment:
    - MYSQL_ROOT_PASSWORD=${DB_ROOT_PASSWORD}
    - MYSQL_DATABASE=${DB_NAME}
    - MYSQL_USER=${DB_USER}
    - MYSQL_PASSWORD=${DB_PASSWORD}
```
- Configuración inicial de la base de datos
- Crea automáticamente la base de datos y el usuario especificados
- El usuario root usa `DB_ROOT_PASSWORD`, mientras que `DB_USER` es un usuario adicional

```yaml
  volumes:
    - db_data:/var/lib/mysql
    - ./docker/db/init.sql:/docker-entrypoint-initdb.d/init.sql
```
- **db_data**: Volumen persistente para almacenar los datos de la BD (no se pierden al reiniciar)
- **init.sql**: Script que se ejecuta automáticamente al crear la base de datos por primera vez (crea la tabla `usuarios` e inserta datos de prueba)

---

## Servicio 3: phpMyAdmin

```yaml
phpmyadmin:
  image: phpmyadmin/phpmyadmin:latest
```
- Interfaz web para administrar la base de datos visualmente

```yaml
  ports:
    - "8081:80"
```
- Accesible desde `http://localhost:8081`

```yaml
  environment:
    - PMA_HOST=database
    - PMA_PORT=3306
    - PMA_USER=${DB_USER}
    - PMA_PASSWORD=${DB_PASSWORD}
    - UPLOAD_LIMIT=100M
```
- Se conecta automáticamente al servicio `database`
- Permite importar archivos SQL de hasta 100MB

```yaml
  depends_on:
    - database
```
- Garantiza que la base de datos esté lista antes de iniciar phpMyAdmin

---

## Volúmenes

```yaml
volumes:
  db_data:
```
- Define un volumen nombrado para persistencia de datos
- Los datos de MariaDB sobreviven aunque elimines los contenedores

---

## Redes

```yaml
networks:
  app-network:
    driver: bridge
```
- Crea una red privada llamada `app-network`
- Todos los servicios pueden comunicarse entre sí usando sus nombres como hostname
- El driver `bridge` es el tipo estándar para redes locales en Docker

---

## Flujo de funcionamiento

1. **Al ejecutar `docker-compose up`**:
   - Se crea la red `app-network`
   - Se inicia `database`, ejecuta `init.sql` y crea el usuario
   - Se inicia `web` y `phpmyadmin` (después de que database esté listo)

2. **Comunicación interna**:
   - PHP se conecta a la BD usando `database:3306` (no `localhost`)
   - phpMyAdmin se conecta igual usando el hostname `database`

3. **Acceso externo**:
   - Aplicación web: `http://localhost:8080`
   - phpMyAdmin: `http://localhost:8081`
   - Base de datos: `localhost:3306` (con cliente MySQL)

Este setup es ideal para desarrollo local, proporcionando un entorno completo y aislado que se puede levantar con un solo comando.
