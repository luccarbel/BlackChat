import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PhotoGallery.css';
import { FaHeart, FaComment } from 'react-icons/fa';
import { resolveMediaUrl } from '../config';
import { getLocalPhotos, saveLocalPhoto, toggleLocalLike } from '../storage';

function PhotoGallery({ userId }) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadData, setUploadData] = useState({
    photo: null,
    caption: '',
    tags: ''
  });
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await axios.get('/api/photos');
      setPhotos(response.data);
    } catch {
      setPhotos(getLocalPhotos());
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setUploadData({ ...uploadData, photo: e.target.files[0] });
  };

  const fileToDataUrl = (file) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });

  const handleUploadPhoto = async (e) => {
    e.preventDefault();
    if (!uploadData.photo) return;

    const formData = new FormData();
    formData.append('photo', uploadData.photo);
    formData.append('userId', userId);
    formData.append('caption', uploadData.caption);
    formData.append('tags', uploadData.tags);

    try {
      const response = await axios.post('/api/photos/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setPhotos([response.data, ...photos]);
    } catch {
      const dataUrl = await fileToDataUrl(uploadData.photo);
      const created = saveLocalPhoto({
        dataUrl,
        caption: uploadData.caption,
        tags: uploadData.tags,
        userId,
      });
      setPhotos([created, ...photos]);
    } finally {
      setUploadData({ photo: null, caption: '', tags: '' });
      setShowUpload(false);
    }
  };

  const handleLike = async (photoId) => {
    try {
      const response = await axios.post(`/api/photos/${photoId}/like`, { userId });
      const updatedPhotos = photos.map(p => p._id === photoId ? response.data : p);
      setPhotos(updatedPhotos);
      if (selectedPhoto?._id === photoId) setSelectedPhoto(response.data);
    } catch {
      const updated = toggleLocalLike(photoId, userId);
      if (updated) {
        const updatedPhotos = photos.map(p => p._id === photoId ? updated : p);
        setPhotos(updatedPhotos);
        if (selectedPhoto?._id === photoId) setSelectedPhoto(updated);
      }
    }
  };

  if (loading) {
    return <div className="loading">Cargando galería...</div>;
  }

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <h1>Galería de Fotos Anónimas</h1>
        <button 
          className="btn-upload"
          onClick={() => setShowUpload(!showUpload)}
        >
          {showUpload ? '✕ Cancelar' : '+ Subir Foto'}
        </button>
      </div>

      {showUpload && (
        <form className="upload-form" onSubmit={handleUploadPhoto}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
          <input
            type="text"
            placeholder="Escribir un caption (opcional)"
            value={uploadData.caption}
            onChange={(e) => setUploadData({ ...uploadData, caption: e.target.value })}
          />
          <input
            type="text"
            placeholder="Tags separados por coma"
            value={uploadData.tags}
            onChange={(e) => setUploadData({ ...uploadData, tags: e.target.value })}
          />
          <button type="submit" className="btn-submit">Subir Foto</button>
        </form>
      )}

      <div className="gallery-grid">
        {photos.length === 0 ? (
          <div className="no-photos">
            <p>No hay fotos aún. ¡Sé el primero en subir!</p>
          </div>
        ) : (
          photos.map((photo) => (
            <div 
              key={photo._id} 
              className="photo-card"
              onClick={() => setSelectedPhoto(photo)}
            >
              <img src={resolveMediaUrl(photo.filepath)} alt="Foto anónima" />
              <div className="photo-overlay">
                <div className="photo-stats">
                  <span className="stat">
                    <FaHeart /> {photo.likes}
                  </span>
                  <span className="stat">
                    <FaComment /> {photo.comments?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedPhoto && (
        <div className="modal" onClick={() => setSelectedPhoto(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="btn-close" onClick={() => setSelectedPhoto(null)}>✕</button>
            <div className="modal-body">
              <img src={resolveMediaUrl(selectedPhoto.filepath)} alt="Foto" />
              <div className="modal-info">
                <h3>{selectedPhoto.caption || 'Sin título'}</h3>
                <div className="modal-stats">
                  <button 
                    className={`like-btn ${selectedPhoto.likedBy?.includes(userId) ? 'liked' : ''}`}
                    onClick={() => handleLike(selectedPhoto._id)}
                  >
                    <FaHeart /> {selectedPhoto.likes}
                  </button>
                </div>
                {selectedPhoto.tags && selectedPhoto.tags.length > 0 && (
                  <div className="tags">
                    {selectedPhoto.tags.map((tag, idx) => (
                      <span key={idx} className="tag">#{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PhotoGallery;
