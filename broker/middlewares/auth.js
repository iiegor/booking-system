function needsAuthorization (req, res, next) {
  // Auth logic here
  
  next()
}

exports.needsAuthorization = needsAuthorization
