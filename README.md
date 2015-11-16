# Emissary
React front-end

##Prerequisites
- Node 4.1.2

## Running
Emissary includes a live-reloading static server on port `8080` which will build, launch, and rebuild the app whenever you change application code. To start the server, run:

```bash
$ npm start
```

If you prefer to just build without the live reload and build-on-each-change watcher, run:

```bash
$ npm run build
```

## Environment Config
There are a few configurable environment parameters:

Configure bartnet URL:
```CONFIG_API=http://localhost:9000 npm start```

Configure fieri URL:
```CONFIG_AUTH=http://localhost:9000 npm start```

Or any combination.

## Behavior Config
When running in non-production environments, certain behaviors can be altered by using a config.json file at the root directory. Use config-example.json to view all configurable parameters.