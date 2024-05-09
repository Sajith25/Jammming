import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import Playlist from './components/Playlist';
import Spotify from './utils/Spotify';
import styles from './styles/App.module.css';

function App() {
    const [playlistTitle, setPlaylistTitle] = useState('');
    const [playlistTracks, setPlaylistTracks] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        Spotify.getAccessToken();
    }, []);

    const handleSearchValue = (e) => {
        setSearchValue(e.target.value);
    };

    const handleSearch = (term) => {
        console.log('Search Term:', term);
        Spotify.search(term).then((results) => {
            setSearchResults(results);
        }).catch(error => console.error(error));
        console.log('Search Term:', term)
    };


    const handleTitle = (e) => {
        setPlaylistTitle(e.target.value);
    };

    const handleAdd = (track) => {
        const trackExists = playlistTracks.some((playlistTrack) => 
        playlistTrack.name === track.name && 
        playlistTrack.artist === track.artist);
        if (!trackExists) {
            setPlaylistTracks([...playlistTracks, track]);
            console.log(playlistTracks)
        } else {
            alert('Track already exists in the playlist.');
        }
    };

    const handleRemove = (trackToRemove) => {
        const updatedPlaylist = playlistTracks.filter((track) => track.name !== trackToRemove.name);
        setPlaylistTracks(updatedPlaylist);
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (playlistTitle && playlistTracks.length > 0) {
            const uris = playlistTracks.map(track => track.uri);
            Spotify.savePlaylist(playlistTitle, uris)
            alert('Playlist saved')
            setSearchResults([])
            setSearchValue('')
            setPlaylistTitle('')
            setPlaylistTracks('')
        } else {
            alert('Please name your playlist and add tracks.');
        }
    };


    return (
        <div className={styles.container}>
            <header className={styles.title}>
                <h1>Jammming</h1>
            </header>
            <main>
                <div className={styles.searchContainer}>
                    <SearchBar searchValue={searchValue} handleSearch={handleSearch}  handleSearchValue={handleSearchValue} searchResults={searchResults}/>
                </div>
                <div className={styles.outerContainer}>
                    <div className={styles.innerContainer}>
                        <SearchResults searchResults={searchResults} handleAdd={handleAdd} />
                    </div>
                    <div className={styles.innerContainer}>
                        <Playlist playlistTracks={playlistTracks} playlistTitle={playlistTitle} handleTitle={handleTitle} handleRemove={handleRemove} handleSave={handleSave} />
                    </div>
                </div>
            </main>
        </div>
    );
}


export default App;