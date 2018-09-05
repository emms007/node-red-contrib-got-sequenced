# node-red-contrib-got-sequenced

[![Build status][travis-image]][travis-url] [![NPM version][npm-image]][npm-url] [![XO code style][codestyle-image]][codestyle-url]

> A Node-RED [Got](https://github.com/sindresorhus/got) node, for simplified HTTP/HTTPS requests- sequenced version, merged with simple-sequenced queue (https://github.com/shady2k/node-red-contrib-simple-message-queue)

## Installation

Install `node-red-contrib-got-sequenced` using [npm](https://www.npmjs.com/):

```bash
npm install --save node-red-contrib-got-sequenced
```

## Usage

To use the node, launch Node-RED (see [running Node-RED](http://nodered.org/docs/getting-started/running.html) for help getting started).

The input message&rsquo;s <code>url</code> property will be used as url for the HTTP request.
<code>payload</code> will be used as <code>body</code> for the request and all other properties on
the input message will be used as <a href="https://github.com/sindresorhus/got#options"><code>options</code></a>.

## License

MIT © [Joakim Carlstein](http://joakim.beng.se)

[npm-url]: https://npmjs.org/package/node-red-contrib-got
[npm-image]: https://badge.fury.io/js/node-red-contrib-got.svg
[travis-url]: https://travis-ci.org/joakimbeng/node-red-contrib-got
[travis-image]: https://travis-ci.org/joakimbeng/node-red-contrib-got.svg?branch=master
[codestyle-url]: https://github.com/sindresorhus/xo
[codestyle-image]: https://img.shields.io/badge/code%20style-XO-5ed9c7.svg?style=flat
