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
        return res.status(500).json({
          error: 'no book exist'
        });
      }
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })

    .post(async function (req, res) {
      try {
        const { title } = req.body;

        if (!title) return res.json({ error: 'missing required field title' });

        let book = new Book({
          title: title
        });
        const bookSaved = await book.save();

        return res.json({
          _id: bookSaved._id.toString(),
          title: bookSaved.title
        });
      } catch (err) {
        console.log(err);
        return res.status(500).json({
          error: `error adding book`
        })
      }
      //response will contain new book object including atleast _id and title
    })

    .delete(async function (req, res) {
      try {
        let deleteBooks = await Book.deleteMany({});

        if (deleteBooks.deletedCount > 0) {
          return res.json('complete delete successful');
        } else {
          return res.status(404).json({
            error: 'no books found to delete'
          });
        }
      } catch (err) {
        console.log(err);
        return res.status(500).json({
          error: 'error deleting books'
        });
      }
    });

  app.route('/api/books/:id')

    .get(async function (req, res) {
      try {
        let bookid = req.params.id;
        let book = await Book.findById(bookid);
        
        if (!book) {
          return res.status(404).json({ error: 'no book exists' });
        } else {
          const { _id, title, comments } = book;  
          return res.json({ _id: _id, title: title, comments: comments });
        }
      } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'error fetching book' });
      }
    })

    .post(async function (req, res) {
      try {
        let bookid = req.params.id;
        let comment = req.body.comment;
        let book = await Book.findById(bookid);
        
        if (!comment) return res.status(404).json({ error: 'missing required field comment' });
        if (!book) {
          return res.status(404).json({ error: 'no book exists' });
        } else {
          const { _id, title, comments } = book;

          comments.push(comment);
          await book.save();

          return res.json({ _id: _id, title: title, comments: comments });
        }
      } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'error adding comment' });
      }
    })

    .delete(async function (req, res) {
      try {
        let bookid = req.params.id;
        let deleteResult = await Book.findByIdAndDelete(bookid);

        if (!deleteResult) {
          return res.status(404).json({ error: 'no book exists' });
        } else {
          return res.json('delete successful');
        }
      } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'error deleting book' });
      }
    });
};
