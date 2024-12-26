# Games Hub Backend

(Proyecto MERN 6)

API de puntuaciones y juegos. Continiene una lista de Games. También hay Scores asociadas a un User autenticado el la base de datos y a un Game.

API_URL => https://backendgameshub.onrender.com

## MODELOS

```javascript
const Game = {
  _id: 'id_de_mongoDB',
  name: 'nombre_del_juego',
  difficulty: 'dificultad_del_juego',
  type: 'tipo_de_juego',
  cover: 'imagen_del_juego',
};

const Score = {
  _id: 'id_de_mongoDB',
  user_id: 'id_user_pertenece_score',
  game_id: 'id_game_pertenece_score',
  score: 'puntuación_del_juego',
};

const User = {
  _id: 'id_de_mongoDB',
  nickname: 'nombre_del_user',
  avatar: 'avatar_del_user', // será subido como file y se guardará en Cloudinary
  email: 'email_del_user',
  password: 'contraseña_del_user',
  scores: ['lista', 'scores', 'user'],
  rol: 'rol_del_user',
};
```

### Tener en cuenta:

1. No Todos los campos son requeridos, pero casi todos los son. [Ver directorio models]
2. La imágenes admiten un peso máximo de 1mb.
3. La imagen se sube como archivo. Esta se guardará en Cloudinary automáticamente.

## URLs:

- https://localhost:8080/api
- https://backendgameshub.onrender.com/api

## Endpoints

### MODELO GAMES:

| HTTP Request | Endpoint  | Description                   | Protected | Admin |
| ------------ | --------- | ----------------------------- | --------- | ----- |
| GET          | /games    | Todos los juegos registrados. | No        | No    |
| GET          | /games/id | Juego por su id.              | No        | No    |
| POST         | /games    | Crear un nuevo juego.         | Sí        | Sí    |
| PUT          | /games/id | Editar un juego.              | Sí        | Sí    |
| DELETE       | /games/id | Borrar un juego.              | Sí        | Sí    |

### MODELO SCORES:

| HTTP Request | Endpoint   | Description                   | Protected | Admin |
| ------------ | ---------- | ----------------------------- | --------- | ----- |
| GET          | /scores    | Todas las scores registrados. | No        | No    |
| POST         | /scores    | Crear una nueva review.       | Sí        | No    |
| DELETE       | /scores/id | Borrar una review.            | Sí        | No    |

### MODELO USERS:

| HTTP Request | Endpoint        | Description                      | Protected | Admin |
| ------------ | --------------- | -------------------------------- | --------- | ----- |
| POST         | /users/login    | Login user                       | No        | No    |
| POST         | /users/register | Registrar user (crear).          | No        | No    |
| PUT          | /users/avatar   | Actualizar user avatar.          | Sí        | No    |
| PUT          | /users/         | Actualizar user con bearer token | Sí        | No    |

## Aclaraciones

- Si el endpoint es 'Protected' será necesario estar registrado como User.
- Para acceder a los endpoints 'Protected' se usará un Bearer token.
- Si el endpoint es 'Admin' será necesario ser un User con rol 'admin.

### > Para cualquier duda puedes contartarme al email antaga04@gmail.com :)
