# La Manicurista Simple write-ahead API

This project was generated using [Nx](https://nx.dev).

<p align="center"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="450"></p>

🔎 **Nx is a set of Extensible Dev Tools for Monorepos Develop Like Google, Develop Like Facebook, Develop Like Microsoft**

## Installation

1.  Install dependencies `npm i`
2.  Environments files settings:
    - Files `.env` for production environment
    - Files `.local.env` for development environment. Ovveride settings on files `.env`
3.  **!All ready!**

## Development server

### Express API (JavaScript)

Run `nx serve la-manicurista-express-api` for a dev server. Navigate to http://localhost:3333/. The app will automatically reload if you change any of the source files.

[View API resources](#express-api-resources)

### NestJS API (TypeScript)

Run `nx serve la-manicurista-nest-api` for a dev server. Navigate to http://localhost:4444/. The app will automatically reload if you change any of the source files.

[View API resources](#nestjs-api-resources)

### All APIs

Run `nx run-many --target=serve --projects=la-manicurista-nest-api,la-manicurista-express-api --parallel` for a dev server. Navigate to http://localhost:3333/ for Express API and http://localhost:4444/ for NestJS API. The app will automatically reload if you change any of the source files.

## Build

### Express API (JavaScript)

Run `nx build la-manicurista-express-api` to build the project. The build artifacts will be stored in the `dist/apps/la-manicurista-express-api` directory. Use the `--prod` flag for a production build.

### NestJS API (TypeScript)

Run `nx build la-manicurista-nest-api` to build the project. The build artifacts will be stored in the `dist/apps/la-manicurista-nest-api` directory. Use the `--prod` flag for a production build.

## Running unit tests

### Express API (JavaScript)

- Run `nx test la-manicurista-express-api` to execute the unit tests via [Jest](https://jestjs.io).
- Run `nx affected --target=la-manicurista-express-api` to execute the unit tests affected by a change.

Only tests End To End on APIs resources **Pending unit tests**
<a name="express-api-resources"></a>

1.  /GET typeahead popular users `curl -X GET http://localhost:4444/typeahead/`
2.  /GET typeahead/CaMi prefix exists `curl -X GET http://localhost:4444/typeahead/CaMi`
3.  /GET typeahead/CaMiCaMi prefix not found `curl -X GET http://localhost:4444/typeahead/CaMiCaMi`
4.  /POST typeahead search {"name": "Gert"} and increment popularity(times) `curl -X POST -H "Content-Type: application/json" -d '{"name": "Gert"}' http://localhost:4444/typeahead/`
5.  /POST typeahead {"name": "GertGert"} not found and increment popularity(times) of the users `curl -X POST -H "Content-Type: application/json" -d '{"name": "Gerteee"}' http://localhost:4444/typeahead/`
6.  Validations
    6.1. /GET typeahead/CaMi+ invalid prefix `curl -X GET http://localhost:4444/typeahead/CaMi+`
    6.2. /POST typeahead required { name: } `curl -X POST -H "Content-Type: application/json" http://localhost:4444/typeahead/`
    6.3 /POST typeahead invalid param { name: "\_CaMi\*" } `curl -X POST -H "Content-Type: application/json" -d '{"name": "_Gerte+"}' http://localhost:4444/typeahead/`

### NestJS API (TypeScript)

- Run `nx test la-manicurista-nest-api` to execute the unit tests via [Jest](https://jestjs.io).
- Run `nx affected --target=la-manicurista-nest-api` to execute the unit tests affected by a change.

Only tests End To End on APIs resources **Pending unit tests**
<a name="nestjs-api-resources"></a>

1.  /GET typeahead popular users `curl -X GET http://localhost:3333/typeahead/`
2.  /GET typeahead/CaMi prefix exists `curl -X GET http://localhost:3333/typeahead/CaMi`
3.  /GET typeahead/CaMiCaMi prefix not found `curl -X GET http://localhost:3333/typeahead/CaMiCaMi`
4.  /POST typeahead search {"name": "Gert"} and increment popularity(times) `curl -X POST -H "Content-Type: application/json" -d '{"name": "Gert"}' http://localhost:3333/typeahead/`
5.  /POST typeahead {"name": "GertGert"} not found and increment popularity(times) of the users `curl -X POST -H "Content-Type: application/json" -d '{"name": "Gerteee"}' http://localhost:3333/typeahead/`
6.  Validations
    6.1. /GET typeahead/CaMi+ invalid prefix `curl -X GET http://localhost:3333/typeahead/CaMi+`
    6.2. /POST typeahead required { name: } `curl -X POST -H "Content-Type: application/json" http://localhost:3333/typeahead/`
    6.3 /POST typeahead invalid param { name: "\_CaMi\*" } `curl -X POST -H "Content-Type: application/json" -d '{"name": "_Gerte+"}' http://localhost:3333/typeahead/`

## Understand your workspace

Run `nx dep-graph` to see a diagram of the dependencies of your projects.

## Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.

# La Manicurista I am prepared and recharged :rocket:
