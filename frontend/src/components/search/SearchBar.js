import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchTerm.trim() === "") return; // 빈 검색어 방지
    navigate(`/search?query=${encodeURIComponent(searchTerm)}`); // 검색 결과 페이지로 이동
  };

  return (
    <form className="search-bar" onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="검색어를 입력해주세요"
        value={searchTerm}
        onChange={handleInputChange}
      />
      <button type="submit">
        <FaSearch />
      </button>
    </form>
  );
};

export default SearchBar;
