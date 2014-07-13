# Spotify "save as playlist" polymer element

This is an example of a [Polymer Web Component](http://www.polymer-project.org) that implements a component for saving a list of track uris as a playlist on Spotify. It is in a BETA status and bound to be changed.

## Usage

First, make sure you register an application as a developer on Spotify. Go to [My Applications](https://developer.spotify.com/my-applications) and create a new application. The component needs certain data that you need to specify:

- client_id: The one you get from your app profile
- redirect_uri: An absolute URL pointing to a callback page
- name: The name of the playlist to create
- public: Optional, defaults to true. Whether the playlist will be public. Depending on the value, a different scope will be required.
- uris: A string representation of an array of track uris to append.

The component uses the [Implicit Grant OAuth 2.0 flow](https://developer.spotify.com/web-api/authorization-guide/#implicit_grant_flow) and asks 
See how you would use it:

```html
<html>
<head>
  <script type="text/javascript" src="bower_components/platform/platform.js"></script>

  <link rel="import" href="bower_components/spotify-save-as-playlist/index.html">
</head>
<body>
  <spotify-save-as-playlist
    name="My playlist"
    client-id="<your app client_id>"
    redirect-uri="<your app redirect_uri>"
    uris="['spotify:track:2CAK2t1reUgPK6OMgAMURB']">
  </spotify-save-as-playlist>
</body>
</script>
```

Your redirect-uri will point to a HTML page that gets the access token and passes it to the page where the component is rendered. Grab the contents from the `callback.html` page and paste them in your callback page.

More instructions on how to use the component will be added shortly to the project.

## Why to use the component

The components embeds different steps needed for creating a playlist:

- It provides an easy interface for obtaining an access token from Spotify.
- It fetches the user's id from the logged in user.
- It creates a playlist in the user's library.
- It appends the specified tracks to the playlist that has just been created.

## TODO

- Expose events to subscribe to (token not obtained, error creating a playlist, success creating it...)
- Allow style customisation