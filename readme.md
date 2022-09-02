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

1. copy .env.example to .env
2. change the variables appropriately (PORT, DATABASE_URL)

# DB testing with render

### external address:

x1: ssl: true - YES
x2: ssl:false - NO: need SSL
x3: ssl: RU - YES

### internal address:

i1: ssl: true - NO: self signed certificate
i2: ssl:false - YES
i3: ssl:RU - YES

### takeaway

So to make a connection from render express to render DB either:

- use external db url and ssl:true
- use internal db url and ssl: {rejectUnauthorized:false}

# Render typescript build

- build command: `yarn; yarn build`
- start command: `yarn start`
