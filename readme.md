Rough instructions to recreate from scratch:

```
yarn init -y
yarn add express cors pg dotenv
yarn add -D typescript ts-node-dev @types/express @types/cors @types/pg
yarn run tsc --init
mkdir src
touch index.js
```

### changes to tsconfig.json:

- add `"rootDir": "./src",` (to specify the root folder within your source files)
- add `"outDir": "./dist",` (to specify an output folder for all emitted files)

### changes to package.json

#### add scripts

- add `"build": "tsc"`
- add `"start": "node dist/index.js"`
- add `"start:dev": "ts-node-dev src/index.ts"`

### create .env file
