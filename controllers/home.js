exports.index = (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    if (false) { // TODO
      res.render('search2', {
        title: 'Search2',
        matches: [{
            name: "test",
            image: 'https://media.giphy.com/media/2Y8Iq3xe121Ba3hUAM/giphy.gif'
          },
          {
            name: "test",
            image: 'https://static.spin.com/files/2019/03/GettyImages-1130598318-1554059636-640x401.jpg'
          },
          {
            name: "test",
            image: 'https://i.redd.it/us1zz2mnv9m21.gif'
          },
          {
            name: "test",
            image: 'https://static.spin.com/files/2019/03/GettyImages-1130598318-1554059636-640x401.jpg'
          },
          {
            name: "test",
            image: 'https://media.giphy.com/media/2Y8Iq3xe121Ba3hUAM/giphy.gif'
          }
        ]
      });
    }
  }

  res.render('index2', {
    title: 'Home2'
  });
};
