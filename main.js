(function(Polymer) {
  'use strict';

  Polymer('spotify-save-as-playlist', {

    /**
     * The uris for the tracks to add to the playlist.
     * E.g. ['spotify:track:4kgsK0fftHtg9gZOzkU5T2', 'spotify:track:2CAK2t1reUgPK6OMgAMURB']
     *
     * @property uris
     * @type array
     * @default []
     */
    uris: [],

    /**
     * The name of the playlist.
     *
     * @property name
     * @type string
     * @default 'New Playlist'
     */
    name: 'New Playlist',

    /**
     * The client id of the application.
     *
     * @property client-id
     * @type string
     * @default null
     */
    'client-id': null,

    /**
     * The redirect uri for the OAuth callback.
     *
     * @property redirect-uri
     * @type string
     * @default null
     */
    'redirect-uri': null,
    
    /**
     * Whether the playlist will be public or not in the user's library.
     *
     * @property public
     * @type boolean
     * @default true
     */
    public: true,

    token: null,

    getMe: function(callback) {
      var req = new XMLHttpRequest();
      req.open('GET', 'https://api.spotify.com/v1/me', true);
      req.onreadystatechange = function() {
        if (req.readyState === 4) {
          var data = null;
          try {
            data = req.responseText ? JSON.parse(req.responseText) : '';
          } catch (e) {}

          if (req.status === 200) {
            callback(data);
          }
        }
      };
      req.setRequestHeader('Authorization', 'Bearer ' + this.token);
      req.send(null);
    },

    createPlaylist: function(userId, data, callback) {
      var req = new XMLHttpRequest();
      req.open('POST', 'https://api.spotify.com/v1/users/' + userId + '/playlists', true);
      req.onreadystatechange = function() {
        if (req.readyState === 4) {
          var data = null;
          try {
            data = req.responseText ? JSON.parse(req.responseText) : '';
          } catch (e) {}

          if (req.status === 201) {
            callback(data);
          }
        }
      };
      req.setRequestHeader('Authorization', 'Bearer ' + this.token);
      req.send(JSON.stringify(data));
    },

    addTracksToPlaylist: function(userId, playlistId, uris, callback) {
      var req = new XMLHttpRequest();
      req.open('POST', 'https://api.spotify.com/v1/users/' + userId + '/playlists/' + playlistId + '/tracks', true);
      req.onreadystatechange = function() {
        if (req.readyState === 4) {
          var data = null;
          try {
            data = req.responseText ? JSON.parse(req.responseText) : '';
          } catch (e) {}

          if (req.status === 201) {
            callback(data);
          }
        }
      };
      req.setRequestHeader('Authorization', 'Bearer ' + this.token);
      req.send(JSON.stringify(uris));
    },

    onSave: function() {
      var that = this;

      var w = null;
      function loginWithSpotify() {
          var url = 'https://accounts.spotify.com/authorize?client_id=' + that['client-id'] +
              '&response_type=token' +
              '&scope=playlist-modify' + (that.public ? '' : '-private') +
              '&redirect_uri=' + encodeURIComponent(that['redirect-uri']);
          w = window.open(url, 'Spotify', 'WIDTH=400,HEIGHT=500');
      }

      var loop = function() {
        var message = localStorage.getItem('sp-oauth');
        if (message) {
          localStorage.removeItem('sp-oauth');
          clearInterval(loop);
          if (w !== null) {
            w.close();
            w = null;
          }
          var parsed = JSON.parse(message);
          if (parsed.success) {
            onTokenObtained(parsed.token);
          }
        }
      };

      loop();

      function onTokenObtained(token) {
        that.token = token;
        that.getMe(function(data) {
          var userId = data.id;
          that.createPlaylist(userId, {
            public: that.public,
            name: that.name
          }, function(result) {
            var playlistId = result.id,
                playlistUri = result.uri;
            that.addTracksToPlaylist(userId, playlistId, that.uris, function() {
              that.fire('saved', {
                uri: playlistUri
              });
            }.bind(that));
          }.bind(that));
        }.bind(that));
      }

      loginWithSpotify();
    }
  });

})(window.Polymer);
