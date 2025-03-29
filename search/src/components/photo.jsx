import React, { useState } from 'react';
import axios from 'axios';
import { FaSearch, FaTimes, FaHeart, FaDownload, FaUser, FaArrowLeft } from 'react-icons/fa';
import './ImageGallery.css';

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const apiKey = import.meta.env.VITE_UNSPLASH_API_KEY || '6yycwqFeoWBk_lpVFrifpDRCksb84cv-BDLJszR8Xnc';

  const fetchImages = async (searchTerm) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`https://api.unsplash.com/search/photos`, {
        params: { query: searchTerm || 'random', per_page: 12, client_id: apiKey },
        headers: { 'Accept-Version': 'v1' },
      });
      setImages(response.data.results);
      setSearched(true);
    } catch (err) {
      setError(err.response?.data?.errors?.join(', ') || 'Erro ao carregar imagens.');
      console.error('Erro na API:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) fetchImages(query);
    else {
      setImages([]);
      setSearched(false);
      setError(null);
    }
  };

  const handleClear = () => {
    setQuery('');
    setImages([]);
    setSearched(false);
    setError(null);
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setQuery(newValue);
    if (!newValue.trim()) {
      setImages([]);
      setSearched(false);
      setError(null);
    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseFullscreen = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  const handleDownload = (imageUrl, imageName) => {
    fetch(imageUrl)
      .then((response) => response.ok ? response.blob() : Promise.reject('Erro ao baixar'))
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${imageName || 'imagem'}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => console.error('Erro ao baixar:', err));
  };

  return (
    <div className="min-h-screen font-sans antialiased relative overflow-hidden">
     
      

      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-lg shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-3xl font-extrabold">
              <span className="text-red-500">Search</span>Shots
            </h1>
            <form onSubmit={handleSearch} className="relative w-full max-w-xl">
              <div className="relative flex items-center bg-white rounded-full shadow-md border border-gray-100 overflow-hidden">
                <FaSearch className="absolute left-4 text-gray-400" />
                <input
                  className="w-full pl-12 pr-24 py-3 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                  type="search"
                  value={query}
                  onChange={handleInputChange}
                  placeholder="Explore paisagens, retratos, abstratos..."
                  aria-label="Buscar imagens"
                  autoComplete="off"
                />
                <div className="absolute right-2 flex items-center gap-2">
                  {query && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                      aria-label="Limpar busca"
                    >
                      <FaTimes />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2"
                  >
                    <FaSearch className="sm:hidden" />
                    <span className="hidden sm:inline">Buscar</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {error && (
          <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg">
            <p className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="h-12 w-12 rounded-full border-4 border-red-500 border-t-transparent animate-spin"></div>
              <FaSearch className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-500 text-xl" />
            </div>
            <p className="mt-4 text-gray-600 font-medium">Carregando imagens...</p>
          </div>
        ) : !searched ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-4 animate-fade-in-up">
              Descubra Imagens Incríveis
            </h2>
            <p className="text-gray-500 max-w-md animate-fade-in-up delay-200">
              Pesquise por qualquer tema e encontre fotos de alta qualidade para seus projetos.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold text-gray-800">"{query}"</h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {images.length} resultados
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className="group relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => handleImageClick(image)}
                >
                  <img
                    src={image.urls.regular}
                    alt={image.alt_description || 'Imagem'}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="self-end text-white hover:text-red-400 bg-gray-900/50 p-2 rounded-full"
                      aria-label="Favoritar"
                    >
                      <FaHeart />
                    </button>
                    <div>
                      <p className="text-white font-medium line-clamp-1">{image.alt_description || 'Sem título'}</p>
                      <p className="text-white/80 text-sm flex items-center gap-1">
                        <FaUser size={12} /> {image.user.name}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-gray-900/90 rounded-xl overflow-hidden shadow-2xl">
            <button
              onClick={handleCloseFullscreen}
              className="absolute top-4 left-4 text-white hover:text-red-400 z-10 p-2 rounded-full bg-gray-900/50"
              aria-label="Fechar"
            >
              <FaArrowLeft size={20} />
            </button>
            <div className="flex flex-col md:flex-row">
              <img
                src={selectedImage.urls.full}
                alt={selectedImage.alt_description || 'Imagem'}
                className="w-full md:w-2/3 h-[50vh] md:h-[70vh] object-cover"
              />
              <div className="p-6 text-white space-y-6 md:w-1/3">
                <h2 className="text-xl font-semibold line-clamp-2">{selectedImage.alt_description || 'Sem título'}</h2>
                <div className="flex items-center gap-3">
                  <img
                    src={selectedImage.user.profile_image.medium}
                    alt={selectedImage.user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium">{selectedImage.user.name}</p>
                    <p className="text-gray-400 text-sm">@{selectedImage.user.username}</p>
                  </div>
                </div>
                {selectedImage.description && (
                  <p className="text-gray-300 text-sm">{selectedImage.description}</p>
                )}
                <div className="flex gap-4">
                  <p className="flex items-center gap-1">
                    <FaHeart className="text-red-400" /> {selectedImage.likes}
                  </p>
                  <p className="flex items-center gap-1">
                    <FaDownload className="text-blue-400" /> {selectedImage.downloads || 'N/A'}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedImage.tags?.map((tag, index) => (
                    <span key={index} className="bg-gray-800/50 px-2 py-1 rounded-full text-xs">
                      {tag.title}
                    </span>
                  )) || <span className="text-gray-400 text-sm">Sem tags</span>}
                </div>
                <button
                  onClick={() => handleDownload(selectedImage.urls.full, selectedImage.alt_description || selectedImage.id)}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <FaDownload /> Baixar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-gray-50 py-6 border-t border-gray-100 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} SearchShots. Powered by Unsplash.</p>
        </div>
      </footer>
    </div>
  );
};

export default ImageGallery;