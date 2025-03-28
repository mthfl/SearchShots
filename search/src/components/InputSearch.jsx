import { FaSearch, FaTimes } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";

/**
 * Componente de campo de busca avançado
 * 
 * @param {Object} props - Propriedades do componente
 * @param {string} [props.initialValue=""] - Valor inicial do campo
 * @param {function} [props.onSearch] - Função chamada ao realizar busca (com debounce)
 * @param {function} [props.onChange] - Função chamada em cada alteração
 * @param {number} [props.debounceTime=500] - Tempo de debounce em ms
 * @param {string} [props.placeholder="Pesquisar..."] - Texto do placeholder
 * @param {string} [props.className=""] - Classes CSS adicionais
 * @returns {JSX.Element} Componente de input de busca
 */
function InputSearch({
  initialValue = "",
  onSearch,
  onChange,
  debounceTime = 500,
  placeholder = "Pesquisar...",
  className = ""
}) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [debouncedSearchTerm] = useDebounce(searchTerm, debounceTime);

  // Atualiza o estado interno se initialValue mudar externamente
  useEffect(() => {
    setSearchTerm(initialValue);
  }, [initialValue]);

  // Dispara busca quando o termo com debounce muda
  useEffect(() => {
    if (onSearch && debouncedSearchTerm.trim() !== "") {
      onSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, onSearch]);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onChange) {
      onChange(value);
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    if (onChange) {
      onChange("");
    }
    if (onSearch) {
      onSearch("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch && searchTerm.trim() !== "") {
      onSearch(searchTerm);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={`relative w-full max-w-[400px] ${className}`}
    >
      <div className="relative w-full">
        <input
          className={`w-full h-10 pl-10 pr-10 rounded-xl border-2 border-gray-200 
                     focus:outline-none focus:border-blue-400 transition-colors 
                     duration-200 text-gray-700 ${searchTerm ? "pr-10" : ""}`}
          type="search"
          value={searchTerm}
          onChange={handleChange}
          placeholder={placeholder}
          aria-label={placeholder}
          autoComplete="off"
        />
        
        {/* Ícone de busca */}
        <button 
          type="submit"
          className="absolute left-3 top-1/2 transform -translate-y-1/2 
                    text-gray-400 hover:text-gray-600 focus:text-gray-600 
                    focus:outline-none"
          aria-label="Buscar"
        >
          <FaSearch />
        </button>
        
        {/* Botão para limpar (aparece apenas quando há texto) */}
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 
                      text-gray-400 hover:text-gray-600 focus:text-gray-600 
                      focus:outline-none"
            aria-label="Limpar busca"
          >
            <FaTimes />
          </button>
        )}
      </div>
    </form>
  );
}

export default InputSearch;