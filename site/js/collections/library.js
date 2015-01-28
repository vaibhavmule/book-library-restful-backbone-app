// site/js/collections/library.js

app.Library = Backbone.Collection.extend({
	model: app.Book,
	url: '/api/books'
});
