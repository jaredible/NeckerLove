exports.index = (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    res.render('search', {
      title: 'Search'
    });
    return;
  }

  res.render('index2', {
    title: 'Home'
  });
};
