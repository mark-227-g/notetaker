const uuid = require('../helpers/uuid');

const notes = [
  {
    "title":"Test Title1",
    "text":"Test text1",
    note_id: uuid(),
  },
  {
    "title":"Test Title2",
    "text":"Test text2",
    note_id: uuid(),
  },
  {
    "title":"Test Title3",
    "text":"Test text3",
    note_id: uuid(),
  },
];

module.exports = notes;
