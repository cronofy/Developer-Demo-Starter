# Cronofy UI Elements: demo application

This repo is to be used alongside the [Developer Demo Tutorial](https://docs.cronofy.com/developers/getting-started/demo-app).

This repo contains two branches: `starter`, and `master`.

* The starter code you need to follow along with the tutorial is on the `starter` branch. Checkout this branch if you want to work through the tutorial step-by-step.
* The completed code for the tutorial is on the `master` branch. Checkout this branch if you want to view the full, finished code for the tutorial (including some extra error handling not covered in the tutorial itself).

## Quickstart guide

1. Clone this repository.
2. `cd` into this repository's root directory.
3. Create a `.env` file with the following contents:

```
CLIENT_ID="YOUR_CLIENT_ID_GOES_HERE"
CLIENT_SECRET="YOUR_CLIENT_SECRET_GOES_HERE"
ACCESS_TOKEN="YOUR_ACCESS_TOKEN_GOES_HERE"
SUB="YOUR_SUB_GOES_HERE"
DATA_CENTER="YOUR_DATA_CENTER_ID_GOES_HERE"
```

4. Run `npm install`: this will download the required dependencies.
5. Run `npm run start` to start the server.
6. You can then view the running application at [http://localhost:7070/](http://localhost:7070/).

## Technologies used

* [Express](https://expressjs.com/) for serving
* [EJS](https://ejs.co/) for templating
