const fs = require("fs");
const path = require("path");

function fileExists(
  filePath: string
) {
  if (!filePath) {
    return false;
  }

  return fs.existsSync(filePath);
}

function deleteFile(
  filePath: string
) {
  if (!filePath) {
    return false;
  }

  if (!fs.existsSync(filePath)) {
    return false;
  }

  fs.unlinkSync(filePath);

  return true;
}

function deleteFileAsync(
  filePath: string
) {
  return new Promise<boolean>(
    (resolve) => {
      if (!filePath) {
        return resolve(false);
      }

      fs.unlink(
        filePath,
        (error: any) => {
          if (error) {
            return resolve(false);
          }

          resolve(true);
        }
      );
    }
  );
}

function getFileExtension(
  filePath: string
) {
  if (!filePath) {
    return "";
  }

  return path
    .extname(filePath)
    .toLowerCase();
}

function getVideoContentType(
  filePath: string
) {
  const extension =
    getFileExtension(filePath);

  const mimeTypes: {
    [key: string]: string;
  } = {
    ".webm": "video/webm",
    ".mp4": "video/mp4",
    ".mov": "video/quicktime",
    ".ogg": "video/ogg",
    ".ogv": "video/ogg",
  };

  return (
    mimeTypes[extension] ||
    "video/webm"
  );
}

module.exports = {
  fileExists,
  deleteFile,
  deleteFileAsync,
  getFileExtension,
  getVideoContentType,
};

export {};