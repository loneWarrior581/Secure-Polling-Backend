# Polling Application Backend

<p align="center">
  <a href="https://github.com/loneWarrior581">
    <img src="https://img.icons8.com/clouds/100/000000/survey.png" alt="Logo" width="150">
  </a>

  <h3 align="center">Poll One</h3>
  <h3 align="center">Vote one Everyone🤞</h3>
  <p align="center">
    <br />
    <a href="https://dazzling-dijkstra-dbd40e.netlify.app/"><strong> View Demo »</strong></a>
    ·
    <a href="https://github.com/loneWarrior581/Backend-polling-app/issues">Request Feature</a>
  </p>
</p>
<hr>

## Getting Started 🔥

1.  Fork the repo and Clone the forked repository using code in the terminal

```
    git clone https://github.com/loneWarrior581/Backend-polling-app
```

2. After cloning the repo open the terminal in the root directory and write `npm install` to install the required dependencies

3. Make a `.env` file in the root directory

4. Add the following in the `.env` file

```
    MONGO_URI="your mongodb URI"
    PASS="password for the mongodb URI"
    USER="User name for the mongodb URI"
```

**You can get the mongoDb URI using [MONGODB ATLAS](https://www.mongodb.com/cloud/atlas)**
<br> 5. Write `npm start` in the terminal and your server is Up 🚀 and running on http://localhost:8000

### Api endpoints

- POST `/vote`

```
   {
       name:String,
       choice:boolean,
       casted_at:String
   }
```

- GET `/data`(We array of objects of the data being posted as a POST request at `/vote`)

- GET `/result`
- GET `/countT`
- GET `/countF`
