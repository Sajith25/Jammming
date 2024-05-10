const clientId = '4264b0b452c84fb89ff52803f44dfa4a';
const redirectUri = 'http://sjammingu.netlify.app';
let accessToken;

const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }

        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            window.setTimeout(() => {
                accessToken = '';
                window.history.pushState('Access Token', null, '/');
            }, expiresIn * 1000);
            return accessToken;
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
            window.location = accessUrl;
        }
    },

    search(term) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Failed to fetch tracks.');
        })
        .then(jsonResponse => {
            if (!jsonResponse.tracks) {
                return [];
            }
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri,
                preview_url: track.preview_url
            }));
        });
    },    

    savePlaylist(name, trackUris) {
        if (!name || !trackUris.length) {
            return Promise.reject('Name or Track URIs missing');
        }

        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        let userId;

        return fetch('https://api.spotify.com/v1/me', { headers: headers })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Failed to fetch user ID.');
        })
        .then(jsonResponse => {
            userId = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({ name: name })
            });
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Failed to create playlist.');
        })
        .then(jsonResponse => {
            const playlistId = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({ uris: trackUris })
            });
        })
        .then(response => {
            if (response.ok) {
                return true;
            }
            throw new Error('Failed to add tracks to playlist.');
        })
        .catch(error => {
            console.error(error);
            return false;
        });
    }
};

export default Spotify;
