# Cronofy UI Elements: demo application

## Quickstart guide

1. Clone this repository.
2. `cd` into this repository's root directory.
3. Create a `.env` file with the following contents:

```
CLIENT_ID="YOUR_CLIENT_ID_GOES_HERE"
CLIENT_SECRET="YOUR_CLIENT_SECRET_GOES_HERE"
```

4. Run `make init`: this will download the required dependencies, build the assets, and start the server.
5. You can then view the running application at [http://localhost:7070/](http://localhost:7070/).
6. Enter your credentials into the form on the start-up page, and then you're all set.

## Technologies used

* [Express](https://expressjs.com/) for serving
* [EJS](https://ejs.co/) for templating
* [Webpack](https://webpack.js.org/) for asset bundling