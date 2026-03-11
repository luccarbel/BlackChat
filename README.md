# BlackChat 🖤

Una aplicación web móvil para chats y fotos anónimas en tiempo real.

## Características

- ✅ **Chats Anónimos en Tiempo Real** - Comunícate sin revelar tu identidad
- ✅ **Galería de Fotos Anónimas** - Comparte fotos con la comunidad
- ✅ **Salas Temáticas** - Múltiples salas de chat
- ✅ **Sistema de Likes** - Dale like a las fotos
- ✅ **Responsive Design** - Funciona perfecto en móvil y desktop
- ✅ **WebSockets** - Actualizaciones en tiempo real

## Tecnologías

### Frontend
- React 18
- Socket.io-client
- React Router
- Axios
- CSS3 con diseño responsive

### Backend
- Node.js + Express
- Socket.io (WebSockets)
- MongoDB
- Multer (manejo de archivos)
- JWT (autenticación)

## Instalación

### Requisitos
- Node.js (v14 o superior)
- MongoDB (local o Atlas)
- Git

### 1. Clonar el repositorio
```bash
git clone https://github.com/tuusuario/BlackChat.git
cd BlackChat
```

### 2. Instalar dependencias del servidor
```bash
cd server
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
# Edita .env con tus credenciales de MongoDB
```

### 4. Instalar dependencias del cliente
```bash
cd ../client
npm install
```

## Ejecutar la aplicación

### Terminal 1 - Servidor
```bash
cd server
npm run dev
# Servidor ejecutándose en http://localhost:5000
```

### Terminal 2 - Cliente
```bash
cd client
npm start
# Cliente ejecutándose en http://localhost:3000
```

## Despliegue en GitHub Pages (solo frontend)

GitHub Pages publica sitios estaticos. En este proyecto eso significa que solo se puede publicar `client/` en Pages; el backend `server/` debe ir en otro hosting (Render, Railway, Fly.io, etc.).

### 1. Configurar variables del frontend

Crea `client/.env.production` con:

```bash
REACT_APP_API_URL=https://TU_BACKEND_PUBLICO
REACT_APP_SERVER_URL=https://TU_BACKEND_PUBLICO
```

### 2. Publicar a GitHub Pages

```bash
cd client
npm install
npm run deploy
```

### 3. Habilitar Pages en GitHub

En el repositorio: `Settings > Pages`.

- Source: `Deploy from a branch`
- Branch: `gh-pages`
- Folder: `/ (root)`

La URL correcta queda como:

`https://TU_USUARIO.github.io/TU_REPO/`

Si abres `https://github.com/TU_USUARIO/TU_REPO`, siempre veras el README porque esa es la vista del repositorio, no el sitio publicado.

## Estructura del Proyecto

```
BlackChat/
├── client/                 # Frontend React
│   ├── public/
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   ├── pages/         # Páginas principales
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── server/                # Backend Node.js/Express
│   ├── models/           # Modelos de MongoDB
│   ├── routes/           # Rutas API
│   ├── server.js         # Archivo principal
│   ├── .env.example
│   └── package.json
│
└── README.md
```

## API Endpoints

### Usuarios
- `POST /api/users/create` - Crear usuario anónimo
- `GET /api/users/:anonymousId` - Obtener usuario

### Chats
- `POST /api/chats/rooms` - Crear sala
- `GET /api/chats/rooms` - Obtener todas las salas
- `GET /api/chats/rooms/:roomId` - Obtener sala específica
- `POST /api/chats/rooms/:roomId/messages` - Guardar mensaje

### Fotos
- `POST /api/photos/upload` - Subir foto
- `GET /api/photos` - Obtener todas las fotos
- `GET /api/photos/:photoId` - Obtener foto específica
- `POST /api/photos/:photoId/like` - Dar like
- `POST /api/photos/:photoId/comment` - Comentar

## WebSocket Events

- `join-room` - Unirse a una sala
- `send-message` - Enviar mensaje
- `receive-message` - Recibir mensaje
- `user-joined` - Usuario se une a una sala

## Licencia

MIT

## Autor

Creado con ❤️

---

¿Preguntas? Abre un issue en GitHub.
