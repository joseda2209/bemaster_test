
# BeMaster prueba Tecnica

Este proyecto es una prueba tecnica para el puesto de Desarrollo Full-Stack de la empresa Bemaster simulando una página de streming como Netfilx.
Consta de una Rest-API usando Node.js y ExpressJs, para crear un servidor que permita realizar los cambios sobre la base de datos en MySQL
Asi mismo una applicacion Web con Angular como framework para presentar los formularios y vistas del cliente


## Base de datos

Esta construida en un docker con una imagen de MySql, por lo que encontrara un archivo docker-compose.yml con la configuración del contenedor,
para lanzar este docker puede usar el siguiente comando desde una terminal que este sobre la carpeta de la api
`docker-compose up -d`
Es necesario tener instalado docker en el pc donde se lanzara la api
En caso de tener su propia base de datos puede usar el archivo `.env` para configurar el string de conexion a dicha Base de datos en la variable `DATABASE_URL`

Para la construcción de la base de datos, el archivo Sql esta dentro de la carpeta `streaming-api/prisma/migrations/20220808065147_init`, esto porque se uso prisma para generar tanto la base de datos como el modelo y el cliente de conexion. asi mismo es posible generar la base de datos  usando el siguiente comando desde una terminal que este sobre la carpeta de la api:
`npx prisma migrate deploy`

En caso de que el comando tenga un error por permisos se debera usar el usuario root para dar permisos al usuario de la api, si usa docker-compose, dentro del mismo archivo se encuentra la clave para ingresar con el usuario root desde el cliente de su preferencia, dentro del cliente se puede ejecutar el siguiente comando para dar los permisos necesarios. 
`GRANT CREATE, ALTER, DROP, REFERENCES  ON *.* TO 'streamingDB_user'@'%';`

Adicionalmente, para los datos iniciales como son los Roles y el usuario Administrador existe un archivo sql dentro de la carpeta streaming-api llamado `InsertFirsValues.sql` donde se pueden ejecutar los comandos uno por uno. en el caso de la contraseña del adminsitrador, debido a que se usa una encriptacion basada en hash se debera remplazar la variable `{password_encripted}` para que la api funcione correctamente. Para esto se construyo un script que entrega la clave encriptada según se decida. Para ejecutar el script escriba en la consola que este sobre la carpeta de la api:
`npm run cryptPass {password}`   remplazando {password} por la contraseña que necesite.

## Streaming-API

#### Token
Se uso un token basado en JWT para el ingreso a la información, este se entrega desde el login y contiene el email del usuario, su id y su rol, esto tambien para el ingreso a peticiones que solo el Rol Administrador puede obtener.

#### Rutas

##### GET v1.0/status
devuelve ok si la aplicación responde

##### POST v1.0/login
realiza el logueo del usuario
- body:
```json
email,
password
```

##### POST v1.0/logout
realiza el deslogueo del usuario, no necesita datos, usa el JWT para la función.

##### POST v1.0/category
crea una categoria nueva
- body:
```json
name
```

##### GET v1.0/categories
obtiene todas las categorias

##### GET v1.0/category/:id
obtiene una categoria por su id
- params
```json
id
```
##### DELETE v1.0/category/:id
borra una categoria por su id
- params
```json
id
```

##### GET v1.0/category/:id/content
obtiene el contenido que pertenece a una categoria
- params
```json
id
```

##### POST v1.0/content
crea un contenido nuevo
- body:
```json
    id,
    name,
    author,
    duration,
    year,
    synopsis,
    url,
    categories: []
```
##### DELETE v1.0/content/:id
borra un contenido por su id
- params
```json
id
```
##### GET v1.0/contents
obtiene todos los contenidos

##### GET v1.0/content/:id
obtiene un contenido por su id
- params
```json
id
```

##### PATCH v1.0/content/:id
actualiza un contenido existente
- params
```json
id
```
- body:
```json
    id,
    name,
    author,
    duration,
    year,
    synopsis,
    url,
    categories:[]
```

##### GET v1.0/users
obtiene todos los usuarios
##### GET v1.0/user/:id
obtiene un usuario por su id
- params
```json
id
```
##### POST v1.0/user
crea un usuario nuevo
- body:
```json
    id,
    name,
    lastname,
    email,
    password,
    document,
    rolId,
```
##### PATCH v1.0/user/:id
actualiza un usuario por su id
- params
```json
id
```
- body:
```json
    id,
    name,
    lastname,
    email,
    password,
    document,
    rolId,
```
##### DELETE v1.0/user/:id
borra un usuario por su id
- params
```json
id
```

##### POST v1.0/user/:id/content
agreaga el contenido a un usuario
- params
```json
id
```
- body
```json
contents: []
```

##### GET v1.0/user/:id/content
obtiene el contenido asociado a un usuario
- params
```json
id
```
