const ROOMS_KEY = 'blackchat_rooms';
const MESSAGES_KEY = 'blackchat_messages';
const PHOTOS_KEY = 'blackchat_photos';

function read(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

function write(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ---- Rooms ----

export function getLocalRooms() {
  return read(ROOMS_KEY);
}

export function saveLocalRoom(room) {
  const rooms = read(ROOMS_KEY);
  const newRoom = {
    ...room,
    roomId: room.roomId || `room_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    messages: [],
    activeUsers: 0,
    createdAt: new Date().toISOString(),
  };
  rooms.push(newRoom);
  write(ROOMS_KEY, rooms);
  return newRoom;
}

// ---- Messages ----

function messagesKey(roomId) {
  return `${MESSAGES_KEY}_${roomId}`;
}

export function getLocalMessages(roomId) {
  return read(messagesKey(roomId));
}

export function getLocalRoom(roomId) {
  const rooms = read(ROOMS_KEY);
  const room = rooms.find((r) => r.roomId === roomId);
  if (!room) return null;
  room.messages = getLocalMessages(roomId);
  return room;
}

export function saveLocalMessage(roomId, message) {
  const msgs = read(messagesKey(roomId));
  msgs.push({ ...message, id: Date.now() });
  write(messagesKey(roomId), msgs);
  return msgs;
}

// ---- Photos ----

export function getLocalPhotos() {
  return read(PHOTOS_KEY);
}

export function saveLocalPhoto(photoData) {
  const photos = read(PHOTOS_KEY);
  const newPhoto = {
    _id: `photo_${Date.now()}`,
    filepath: photoData.dataUrl,
    caption: photoData.caption || '',
    tags: photoData.tags ? photoData.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    userId: photoData.userId,
    likes: 0,
    likedBy: [],
    comments: [],
    createdAt: new Date().toISOString(),
  };
  photos.unshift(newPhoto);
  write(PHOTOS_KEY, photos);
  return newPhoto;
}

export function toggleLocalLike(photoId, userId) {
  const photos = read(PHOTOS_KEY);
  const photo = photos.find((p) => p._id === photoId);
  if (!photo) return null;
  if (!photo.likedBy) photo.likedBy = [];
  const idx = photo.likedBy.indexOf(userId);
  if (idx === -1) {
    photo.likedBy.push(userId);
    photo.likes = (photo.likes || 0) + 1;
  } else {
    photo.likedBy.splice(idx, 1);
    photo.likes = Math.max(0, (photo.likes || 1) - 1);
  }
  write(PHOTOS_KEY, photos);
  return photo;
}
