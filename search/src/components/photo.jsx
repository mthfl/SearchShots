import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState('nature');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Sua chave API - certifique-se que está no .env como REACT_APP_UNSPLASH_API_KEY
  const apiKey = import.meta.env.VITE_UNSPLASH_API_KEY || '6yycwqFeoWBk_lpVFrifpDRCksb84cv-BDLJszR8Xnc';

  const fetchImages = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(
        `https://api.unsplash.com/search/photos`, {
          params: {
            query: query,
            per_page: 12,
            client_id: apiKey
          },
          headers: {
            'Accept-Version': 'v1'
          }
        }
      );
      setImages(response.data.results);
    } catch (err) {
      setError(err.response?.data?.errors?.join(', ') || 'Erro ao carregar imagens');
      console.error('Erro na API:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []); // Executa apenas no mount inicial

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchImages();
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>Unsplash Image Gallery</h1>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for images..."
          style={{ flex: 1, padding: '8px' }}
        />
        <button 
          type="submit"
          disabled={loading}
          style={{ padding: '8px 16px', background: '#4CAF50', color: 'white', border: 'none' }}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && (
        <div style={{ color: 'red', margin: '10px 0' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center' }}>Loading images...</div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '15px'
        }}>
          {images.map((image) => (
            <div key={image.id} style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <img
                src={image.urls.regular}
                alt={image.alt_description || 'Unsplash image'}
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
              <div style={{ padding: '10px' }}>
                <p style={{ margin: 0, fontSize: '14px' }}>
                  Photo by <a 
                    href={`${image.user.links.html}?utm_source=your_app_name&utm_medium=referral`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {image.user.name}
                  </a>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;