# Backbone Presentation Demo

## About

Demo accompanying talk about Backbone.js on DrupalJam2013 presented by [Toon Ketels][].

[Toon Ketels](http://twitter.com/toonketels)


## Usage

Serve the contents of the `www` folder from a webserver.

A node.js dev server is provided for convenience (via grunt).


## Nodejs server

To use the build in server you need to have _nodejs_ and _npm_ installed.

The server is spun using gunt so do:

    npm install -g grunt-cli

Then in this project's root directory do:

    npm install
    grunt build
    grunt

This will run a [server on port 8080](http://localhost:8080),
_automatically compile_ jade/sass to html/css and _watch_
any changes to jade/sass/js to _livereload_ the server.