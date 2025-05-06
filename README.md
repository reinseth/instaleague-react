# Instaleague React

An example single page application (SPA) using [Instant](https://instantdb.com) with
React.

This is the React counterpart of the ClojureScript implementation at 
https://github.com/reinseth/instaleague.

## Objective of the application

The app is used for creating ad hoc leagues for games, e.g. table tennis or pool. The app will
generate the fixtures for a set of players, with or without return matches, and the players can
themselves register scores and results, in a multiplayer fashion, allowing everybody to follow the
live game and league results.

## Architecture

Persistent data is stored in Instant, and transient state is stored in a single store variable.

The app consists of [pages](./src/instaleague/page.cljs) that each define the following properties
- `id` a unique identifier of the page, e.g. `players`
- `route` the route template in the form of `"/players/:id"`
- `query` a function that takes the app state and return an
[instaql](https://www.instantdb.com/docs/instaql) query
- `render` a function that takes the app state and query result and returns a React component

All effects (network/state) are handled at the top level in `main.tsx` following the [Functional
core, imperative
shell](https://www.destroyallsoftware.com/screencasts/catalog/functional-core-imperative-shell)
architecture.

## Prerequisites

- nodejs / npm

## Technologies

- **Instant** https://instantdb.com
- **React** https://react.dev
- **Vite** https://vite.dev
- **Immer** https://immerjs.github.io/immer/
- **tailwindcss** https://tailwindcss.com/
- **daisyUI** https://daisyui.com/

## Getting started

Setup a database in [Instant](https://www.instantdb.com/dash) and add the app-id to `.env.local`:

```
VITE_APP_ID=<your-app-id>
```

Start the app:
- run `npm start`
