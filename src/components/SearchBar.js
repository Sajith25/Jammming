import React from 'react';
import styles from '../styles/SearchBar.module.css'

const SearchBar = (props) => {
    const handleSearch = (e) => {
        e.preventDefault();
        props.handleSearch(props.searchValue); 
        console.log(props.searchResults)
    };

  return (
    <>
        <div className={styles.form}>
            <input 
                id='search' 
                placeholder='Please Enter Song/Artist' 
                type='text' 
                value={props.searchValue || ''} 
                onChange={props.handleSearchValue}
            />
            <button onClick={handleSearch}>Search</button>
        </div>
    </>
  )
}


export default SearchBar;