A wrapper around my ie-supporting fork of [page.js](http://visionmedia.github.com/page.js/).

Either use it as you normally would; or if you want IE8+ support, put the following in your smart.json:

```json
"packages": {
  "HTML5-History-API": {},
  "page-js-ie-support": {}
}
```

*Note for users of the Router*: As of this writing, this version is included from the the `ie-support` branch, so use like so
```json
"packages": {
  "HTML5-History-API": {},
  "router": {
    "git": "https://github.com/tmeasday/meteor-router.git",
    "branch": "ie-support"
  }
}
```
