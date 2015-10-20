# Emissary
React front-end

## Running

The generated project includes a live-reloading static server on port `8080` which will build, launch, and rebuild the app whenever you change application code. To start the server, run:

```bash
$ npm start
```

If you prefer to just build without the live reload and build-on-each-change watcher, run:

```bash
$ npm run build
```

There are a few configurable environment parameters:

Configure bartnet URL:
```CONFIG_API=http://localhost:9000 npm start```

Configure fieri URL:
```CONFIG_AUTH=http://localhost:9000 npm start```

Configure events URL:
```CONFIG_EVENTS=http://localhost:9000 npm start```

Or any combination.