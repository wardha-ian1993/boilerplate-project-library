/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const bookSchema = new Schema({
  title: { type: String, required: true },
  comments: [{ type: String }]
});

const Book = model("Book", bookSchema);

module.exports = function (app) {

  app.route('/api/books')

    .get(async function (req, res) {
      try {
        let query = { ...req.query };
        let book_lists = await Book.find(query);

        let books = book_lists.map(elem => {
          const { _id, title, comments } = elem;
          return {
            _id: _id,
            title: title,
            comments: comments,
            commentcount: comments.length
          }
        });

        return res.json(books);
      } catch (err) {
        console.log(err);
        return res.status(500).json('cannot find books');
      }
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })

    .post(async function (req, res) {
      try {
        const { title } = req.body;
    
        if (!title) return res.send('missing required field title');
    
        let book = new Book({ title });
        const bookSaved = await book.save();
    
        return res.json({
          _id: bookSaved._id.toString(),
          title: bookSaved.title
        });
      } catch (err) {
        console.log(err);
        return res.status(500).send('error adding book');
      }
    })
    
    .delete(async function (req, res) {
      try {
        let deleteBooks = await Book.deleteMany({});

        if (deleteBooks.deletedCount > 0) {
          return res.send('complete delete successful');
        } else {
          return res.status(404).send('no books found to delete');
        }
      } catch (err) {
        console.log(err);
        return res.status(500).send('error deleting books');
      }
    });

  app.route('/api/books/:id')

    .get(async function (req, res) {
      try {
        let bookid = req.params.id;
        let book = await Book.findById(bookid);
        
        if (!book) {
          return res.send('no book exists');
        } else {
          const { _id, title, comments } = book;  
          return res.json({ _id: _id, title: title, comments: comments, commentcount: comments.length });
        }
      } catch (err) {
        console.log(err);
        return res.status(500).send('error fetching book');
      }
    })

    .post(async function (req, res) {
      try {
        let bookid = req.params.id;
        let comment = req.body.comment;
        let book = await Book.findById(bookid);
        
        if (!comment) return res.send('missing required field comment');
        if (!book) {
          return res.send('no book exists');
        } else {
          const { _id, title, comments } = book;

          comments.push(comment);
          await book.save();

          return res.json({ _id: _id, title: title, comments: comments });
        }
      } catch (err) {
        console.log(err);
        return res.status(500).send('error adding comment');
      }
    })

    .delete(async function (req, res) {
      try {
        let bookid = req.params.id;
        let deleteResult = await Book.findByIdAndDelete(bookid);

        if (!deleteResult) {
          return res.send('no book exists');
        } else {
          return res.send('delete successful');
        }
      } catch (err) {
        console.log(err);
        return res.status(500).send('error deleting book');
      }
    });
};
