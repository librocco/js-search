var search;
var indexOnTitle = true, indexOnAuthor = true;
var allBooks = [
  {isbn: '9781743293744', title: 'Old Man\'s War', author: 'John Scalzi'},
  {isbn: '9780312696955', title: 'The Lock Artist', author: 'Steve Hamilton'},
  {isbn: '0321784421', title: 'HTML5', author: 'Remy Sharp'},
  {isbn: '9781409063896', title: 'Right Ho Jeeves', author: 'P.D. Woodhouse'},
  {isbn: '9781863406536', title: 'The Code of the Wooster', author: 'P.D. Woodhouse'},
  {isbn: '9781580811194', title: 'Thank You Jeeves', author: 'P.D. Woodhouse'},
  {isbn: '9780828815130', title: 'The DaVinci Code', author: 'Dan Brown'},
  {isbn: '9780743501569', title: 'Angels & Demons', author: 'Dan Brown'},
  {isbn: '9782267017908', title: 'The Silmarillion', author: 'J.R.R Tolkien'},
  {isbn: '9780143125303', title: 'Syrup', author: 'Max Barry'},
  {isbn: '9781407447292', title: 'The Lost Symbol', author: 'Dan Brown'},
  {isbn: '9780730491217', title: 'The Book of Lies', author: 'Brad Meltzer'},
  {isbn: '9783442541829', title: 'Lamb', author: 'Christopher Moore'},
  {isbn: '9780061974779', title: 'Fool', author: 'Christopher Moore'},
  {isbn: '9780575075337', title: 'Incompetence', author: 'Rob Grant'},
  {isbn: '9780575078208', title: 'Fat', author: 'Rob Grant'},
  {isbn: '9780140289756', title: 'Colony', author: 'Rob Grant'},
  {isbn: '9780140171501', title: 'Backwards, Red Dwarf', author: 'Rob Grant'},
  {isbn: '9780553819229', title: 'The Grand Design', author: 'Stephen Hawking'},
  {isbn: '9781400123230', title: 'The Book of Samson', author: 'David Maine'},
  {isbn: '9780312997304', title: 'The Preservationist', author: 'David Maine'},
  {isbn: '9780312328504', title: 'Fallen', author: 'David Maine'},
  {isbn: '9780312373016', title: 'Monster 1959', author: 'David Maine'}
];

var rebuildSearchIndex = function() {
  search = new JsSearch('isbn');
  if (indexOnTitle) {
    search.addIndex('title');
  }
  if (indexOnAuthor) {
    search.addIndex('author');
  }
  search.addDocuments(allBooks);
};
rebuildSearchIndex();

var indexedBooksTable = document.getElementById('indexedBooksTable');
var indexedBooksTBody = indexedBooksTable.tBodies[0];
var searchResultsList = document.getElementById('searchResultsList');
var searchInput = document.getElementById('searchInput');

var tokenHighlighter = new TokenHighlighter(search.indexStrategy, search.sanitizer);

var updateBooksTable = function(books) {
  indexedBooksTBody.innerHTML = '';

  var tokens = search.tokenizer.tokenize(searchInput.value);

  for (var i = 0, length = books.length; i < length; i++) {
    var book = books[i];

    var isbnColumn = document.createElement('td');
    isbnColumn.innerText = book.isbn;

    var titleColumn = document.createElement('td');
    titleColumn.innerHTML =
      indexOnTitle ?
        tokenHighlighter.highlight(book.title, tokens) :
        book.title;

    var authorColumn = document.createElement('td');
    authorColumn.innerHTML =
      indexOnAuthor ?
        tokenHighlighter.highlight(book.author, tokens) :
        book.author;

    var tableRow = document.createElement('tr');
    tableRow.appendChild(isbnColumn);
    tableRow.appendChild(titleColumn);
    tableRow.appendChild(authorColumn);

    indexedBooksTBody.appendChild(tableRow);
  }

  var searchBooks = function() {
    var query = searchInput.value;
    var results = search.search(query);

    if (results.length > 0) {
      updateBooksTable(results);
    } else if (!!query) {
      updateBooksTable([]);
    } else {
      updateBooksTable(allBooks);
    }
  };

  document.getElementById('authorCheckbox').onchange = function() {
    indexOnAuthor = !indexOnAuthor;
    rebuildSearchIndex();
    searchBooks();
  };
  document.getElementById('titleCheckbox').onchange = function() {
    indexOnTitle = !indexOnTitle;
    rebuildSearchIndex();
    searchBooks();
  };
  searchInput.oninput = searchBooks;
};

updateBooksTable(allBooks);