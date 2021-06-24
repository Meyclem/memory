# Fullstack Memory
## Project Explanation

[📚 Project's documentation 📚](./docs/README.md)

This project is a Memory game made of two parts:
- An `Express` based API
- A `Webpack` front-end application

## Setup

```bash
# Create environment variables files
cp server/.env.sample server/.env
cp client/.env.sample client/.env

# Install Overmind https://github.com/DarthSim/overmind
brew install tmux
brew install overmind

# Install Docker
brew install docker

# Install dependencies
yarn install
```

## Usage

### With Overmind

```bash
# Start applications and database:
yarn dev
# or
overmind start -N
```
It will start 3 services:
- `client`: Front-end starts on http://localhost:7000
- `server`: Back-end starts on http://localhost:7001
- `database`: MongoDB database on `mongodb://memory-api:password@localhost:27017/memory`

To stop all processes, use the `overmind kill` command in another terminal window.

### Without Overmind

```bash
# in src/client
yarn dev

# in src/server
docker compose up
# and in another terminal window
yarn dev
```

## Tests

```bash
# Run client & server tests at one from ./
yarn test

# Run client tests only from ./
yarn workspace client test

# Run client tests from ./client
yarn test

# Run server tests only from ./
yarn workspace server test

# Run server tests from ./server
yarn test
```
