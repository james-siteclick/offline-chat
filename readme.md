# Offline Chat

This is an attempt at making an offline-first web app.

The backend uses Node.js and Fastify, with Drizzle ORM and Postgres.

The frontend uses Vite, React and Zustand for state management. State is persisted in LocalStorage, and a background sync identifies state that needs updating from the backend. This can be observed by running 2 windows concurrently and adding/removing chat rooms.

Yet to be implemented:

- Messages
- Proper authentication (a JWT token is obtained, but this is not added in HTTP requests or verified in the backend)
- Clearing all local storage state on logout

Working:

- Login
- Logout
- Add Chat Room with background syncing
- Delete Chat Room with background syncing

## 1. Clone the repository

```shell
git clone https://github.com/james-siteclick/offline-chat.git
```

## 2. Install Node.js

Node v.20 is used. On a MacOS terminal, Fast Node Manager is recommended. Full instructions are here: https://github.com/Schniz/fnm

```shell
brew install fnm
fnm install
```

## 3. Docker

Docker is used to run the Postgres database for the backend.

```shell
docker-compose up
```

Ensure this remains running in a separate terminal window.

## 4. Installation

```shell
npm i
npm run build
npm run migrate:up
```

## 5. Running the app

In separate terminal windows, run:

```shell
npm run start:backend
```

```shell
npm run start:frontend
```

The frontend task will output a web URL on localhost in the browser.

Log in with either:

- Username `jack`, password `tea`
- Username `jill`, password `coffee`
