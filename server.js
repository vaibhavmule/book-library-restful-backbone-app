// Module dependencies.
var application_root = __dirname,
    express = require( 'express' ), //Web framework
    bodyParser = require('body-parser'), //Parser for reading request body
    path = require( 'path' ), //Utilities for dealing with file paths
    mongoose = require( 'mongoose' ); //MongoDB integration

//Create server
var app = express();

//Where to serve static content
app.use( express.static( path.join( application_root, 'site') ) );

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

//Start server
var port = 4711;

app.listen( port, function() {
    console.log( 'Express server listening on port %d in %s mode', port, app.settings.env );
});


// Routes
app.get('/api', function(req, res){
	res.send('Library API is running');
});

// connect to database
mongoose.connect('mongodb://localhost/library_database');

// Schemas

var Book = new mongoose.Schema({
	title: String,
	author: String,
	releaseDate: Date,
	keywords: [ Keywords ]  
});

var Keywords = new mongoose.Schema({
    keyword: String
});

// models
var BookModel = mongoose.model('Book', Book);

// Configure server


app.use(express.static(path.join(application_root, 'site')));



//Get a list of all books
app.get( '/api/books', function( request, response ) {
    return BookModel.find( function( err, books ) {
        if( !err ) {
            return response.send( books );
        } else {
            return console.log( err );
        }
    });
});

//Insert a new book
app.post( '/api/books', function( request, response ) {
    var book = new BookModel({
        title: request.body.title,
        author: request.body.author,
        releaseDate: request.body.releaseDate,
		keywords: request.body.keywords
    });
    
    return book.save( function( err ) {
        if( !err ) {
            console.log( 'created' );
            return response.send( book );
            } else {
                console.log( err );
            }
    });
});

// Get a single book by id

app.get('/api/books/:id', function(request, response){
	return BookModel.findById( request.params.id, function(err, book){
		if(!err){
			return response.send(book);
		} else {
			return console.log(err);
		}
	});
});

app.put('/api/books/:id', function(request, response){
	console.log('Updating book ' + request.body.title);
	return BookModel.findById(request.params.id, function(err, book){
		book.title = request.body.title;
		book.author = request.body.author;
		book.releaseDate = request.body.releaseDate;
		book.keywords = request.body.keywords;

		return book.save(function(err){
			if(!err) {
				console.log('book updated');
				return response.send(book);
			} else {
				console.log(err);
			}
		});
	});
}); 

// delete a book

app.delete('/api/books/:id', function(request, response){
	console.log('Deleting book with :id' + request.params.id);
	return BookModel.findById(request.params.id, function(err, book){
		return book.remove(function(err){
			if (!err) {
				console.log('Book removed');
				return response.send('');
			} else {
				console.log(err);
			}
		});
	});
}); 


                                    
