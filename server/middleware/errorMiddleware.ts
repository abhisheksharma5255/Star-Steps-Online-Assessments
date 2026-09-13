function errorMiddleware(
  error: any,
  req: any,
  res: any,
  next: any
) {
  console.error(
    "❌ Server error:",
    error
  );

  if (res.headersSent) {
    return next(error);
  }

  res.status(500).json({
    message:
      "Internal server error",
  });
}

module.exports = errorMiddleware;

export {};