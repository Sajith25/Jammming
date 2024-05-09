import React from 'react'
import styles from '../styles/Playlist.module.css'
import Tracklist from './Tracklist'

const Playlist = (props) => {
  return (
    <div className={styles.playlistContainer}>
        <input 
            type='text' 
            placeholder='Name your playlist' 
            value={props.playlistTitle || ''} 
            onChange={props.handleTitle}
        
        />
        <Tracklist playlistTracks={props.playlistTracks} handleRemove={props.handleRemove}/>
        <button type='submit' className={styles.playlistButton} onClick={props.handleSave}>Save To Spotify</button>
    </div>
  )
}

export default Playlist