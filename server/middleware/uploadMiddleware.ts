const multer = require("multer");

/*
=====================================================
TEMPORARY MEMORY STORAGE
=====================================================
*/

const storage = multer.memoryStorage();

/*
=====================================================
MULTER UPLOAD
=====================================================
*/

const upload = multer({
  storage,

  limits: {
    fileSize:
      500 * 1024 * 1024,
  },
});

module.exports = upload;

export {};