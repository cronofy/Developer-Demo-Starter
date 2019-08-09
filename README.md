# Cronofy UI Elements: demo application

This repo is to be used alongside the [Developer Demo Tutorial](https://docs.cronofy.com/developers/getting-started/demo-app). This repo contains the starter code you need to follow along with the tutorial.

You can view the finished code by checking out the `final` branch of this repo.

## Quickstart guide

1. Clone this repository.
2. `cd` into this repository's root directory.
3. Create a `.env` file with the following contents:

```
CLIENT_ID="YOUR_CLIENT_ID_GOES_HERE"
CLIENT_SECRET="YOUR_CLIENT_SECRET_GOES_HERE"
ACCESS_TOKEN="YOUR_ACCESS_TOKEN_GOES_HERE"
SUB="YOUR_SUB_GOES_HERE"
```

4. Run `npm install`: this will download the required dependencies.
5. Run `npm run start` to start the server.
6. You can then view the running application at [http://localhost:7070/](http://localhost:7070/).

## Technologies used

* [Express](https://expressjs.com/) for serving
* [EJS](https://ejs.co/) for templating