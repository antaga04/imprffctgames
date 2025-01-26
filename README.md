# Imprffct Games

This simple mono-repo project using pnpm, React, TypeScript and tailwind for the client and node js with express and mongodb for the server.

## Setup

1. Clone the repository using `git clone git@github.com:antaga04/puzlynk.git` for example.
2. Install dependencies using `pnpm install`
3. Create .env files for the client and server following the .env.dist files.
    - for the server: `cp .env.dist .env.server`
    - for the client: `cp .env.dist .env`
    - read the clarifications to understand the variables.
4. Starting the app:
    - Both client and server: using `pnpm --filter '**' dev`
    - Separated: the server using `pnpm run dev` and the client using `pnpm run start` in each folder.

### Clarifications

#### Server

The server is built using express and mongodb. It uses ES 6 syntax and requires node version 18.x or higher.

For the server to work the .env variable must be set. The .env.dist file contains the variables needed for the server to run.

Mongo is required for the server to run. You can install it globally or use docker to run the server in a container. Just make sure to set the correct MONGODB_URL variable in the .env file.

Cloudinary is used for the server to upload images. You can use your own cloudinary account with the free tier.

Cors is used for access control so you need to set the correct CORS_ORIGIN variable in the .env file.

#### Client

The client is built using React, TypeScript, Tailwind CSS, and pnpm.

For the client to work the .env variable must be set. The .env.dist file contains the variables needed for the client to run.

Right now the client need to know 3 environment variables:

- VITE_API_URL: the url of the server
- VITE_POKEMON_ID: the id of the pokemon game
- VITE_PUZZLE15_ID: the id of the 15 puzzle game

So first you need to create the server and the database and create the games.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request on the GitHub repository.

## License

This project is licensed under the MIT License.
