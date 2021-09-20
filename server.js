const express = require('express');
const cfenv = require('cfenv');
const app = express();
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

// Google Auth
const {OAuth2Client} = require('google-auth-library');
// const CLIENT_ID = '1033687545196-0jo8s5iidvuu77oqoo91fsut7ugbglfo.apps.googleusercontent.com' //local Client ID
const CLIENT_ID = '1033687545196-5td80oeoojsl80alh5rlnflfeo4p3vk1.apps.googleusercontent.com' //Bluemix Client ID
const client = new OAuth2Client(CLIENT_ID);

// load local VCAP configuration
let vcapLocal = null
try {
  vcapLocal = require('./vcap-local.json');
  console.log("Loaded local VCAP", vcapLocal);
} catch (e) {
  console.error(e);
}

const appEnvOpts = vcapLocal ? {
  vcap: vcapLocal
} : {}
const appEnv = cfenv.getAppEnv(appEnvOpts);

let db;
if (appEnv.services['cloudantNoSQLDB']) {
  db = require('./lib/cloudant-db')(appEnv.services['cloudantNoSQLDB'].credentials);
} else {
  db = require('./lib/in-memory')();
}
console.log('Using', db.type());

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json()); // parse application/json
app.use(cookieParser());
app.use(express.static(__dirname + '/www'));
// app.use(express.static('public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', checkAuthenticated, (req, res)=>{
  res.redirect('home.html')
})

app.get('/login', (req,res)=>{
  res.render('login.html');
})

app.post('/login', (req,res)=>{
  let token = req.body.token;

  async function verify() {
      const ticket = await client.verifyIdToken({
          idToken: token,
          audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      });
      const payload = ticket.getPayload();
      const userid = payload['sub'];
    }
    verify()
    .then(()=>{
        res.cookie('session-token', token);
        res.send('success')
    })
    .catch(console.error);

})

app.get('/home', checkAuthenticated, (req, res)=>{
  // res.send(req.user);
  res.redirect('home.html');
})

app.get('/logout', (req, res)=>{
  res.clearCookie('session-token');
  res.redirect('/login')

})

app.get('/api/todos', (req, res) => {
  db.search().then(todos => {
    res.send(todos);
  }).catch(err => {
    res.status(500).send({ error: err });
  });
});

app.post('/api/todos', (req, res) => {
  db.create(req.body).then(todo => {
    res.send(todo);
  }).catch(err => {
    res.status(500).send({ error: err });
  });
});

app.get('/api/todos/:id', (req, res) => {
  db.get(req.params.id).then(todo => {
    res.send(todo);
  }).catch(err => {
    res.status(500).send({ error: err });
  });
});

app.put('/api/todos/:id', (req, res) => {
  db.update(req.params.id, req.body).then(todo => {
    res.send(todo);
  }).catch(err => {
    res.status(500).send({ error: err });
  });
});

app.delete('/api/todos/:id', (req, res) => {
  db.delete(req.params.id).then(todo => {
    res.send(todo);
  }).catch(err => {
    res.status(500).send({ error: err });
  });
});

function checkAuthenticated(req, res, next){

  let token = req.cookies['session-token'];

  let user = {};
  async function verify() {
      const ticket = await client.verifyIdToken({
          idToken: token,
          audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      });
      const payload = ticket.getPayload();
      user.name = payload.name;
      user.email = payload.email;
      user.picture = payload.picture;
    }
    verify()
    .then(()=>{
        req.user = user;
        next();
    })
    .catch(err=>{
        res.redirect('/login')
    })

}

// connect to the database
db.init().then(() => {
  // start server on the specified port and binding host
  app.listen(appEnv.port, "0.0.0.0", function () {
    // print a message when the server starts listening
    console.log("server starting on " + appEnv.url);
  });
});