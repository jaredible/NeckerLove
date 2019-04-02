exports.index = (req, res) => {
  res.render('index', {
    title: 'Home'
  });
};

exports.search = (req, res) => {
  res.render('search', {
    title: 'Search'
  });
};
