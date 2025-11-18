// server.js
const 
express = require('express'),
{ graphqlHTTP } = require('express-graphql'),
cookieParser = require('cookie-parser'),
cors = require('cors'),
// routes to handle others get request
//router = require("./src/othersControllers/index.js"),
router = require("./src/routes/index"),
// body-parser is a Node.js middleware primarily used with the Express.js framework to parse incoming HTTP request bodies.parsing a request" refers to the process of interpreting and extracting meaningful data from an incoming HTTP request sent by a client, body-parser attaches the extracted data to the req.body property of the request object
bodyParser = require('body-parser'),
// represents the routes and ednpoints of every http request
 schema = require('./src/schema/schema'),
 dbConnect = require('./src/config/db'),
 // method-override is middleware that interprets requests according to a specific query
  // parameter and HTTP method. With the _method=PUT query parameter, you can interpret
  // POST requests as PUT requests
methodOverride = require("method-override"),
 port = process.env.PORT || 5000;
// to use .env vars, inside this file
require('dotenv').config();
// middlewares to handle images
const path = require('path');
const fs = require('fs');
// multer function to handle images
const upload = require ('./src/middleware/upload');

const app = express();

app.use(methodOverride("_method", { methods: ["POST", "GET"]}));
// call the database connect function from ./config/db
dbConnect();
// CORS, or Cross-Origin Resource Sharing, in a Node.js server refers to the mechanism that allows a web browser to make requests to a server from a different origin (domain, scheme, or port) than the one that served the original web page.
// Enable CORS for all routes
app.use(cors({ origin:'http://localhost:4200'}));
app.use(bodyParser.json());

// Middleware to parse cookies
app.use(cookieParser());

const UPLOAD_DIR = path.join(__dirname, 'uploads');
// Ensure the uploads directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}


// route to handle the image upload from frontend , this to test if is connecting the frontend with the backend, its just for testing purpose
app.get('/upload-image', (req, res) => {

  const data = {
        message: 'Hello from Node.js API!',
        items: ['item1', 'item2', 'item3']
    };
    res.json(data); // Sends the data as a JSON response
});

/**** some vars */

app.use("/", router);

// REST endpoint for image upload
app.post('/upload-image', upload.single('Dataimage'), (req, res ) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  // Return the path or filename of the uploaded image
   const image = `/uploads/${req.file.filename}`;
   console.log('Im at /upload-image - index - line 67 - image: '+image );
   return res.status(200).json({ image: image});
   
});

// Route to serve static files (images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(
    '/graphql',
      graphqlHTTP(() =>({
        schema,
         graphiql: process.env.NODE_ENV === 'development',

    })
));

app.listen(port, console.log(`Server running on port ${port}`));