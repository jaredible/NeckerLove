exports.index = (req, res) => {
  console.log(req.session.user);
  console.log(req.cookies.user_sid);

  if (req.session.user && req.cookies.user_sid) {
      res.render('search2', {
        title: 'Search2',
        matches: [{
            name: 'Jared Diehl',
            image: 'https://media.giphy.com/media/2Y8Iq3xe121Ba3hUAM/giphy.gif',
            bio: 'I love Rubik\'s Cubes!'
          },
          {
            name: 'John Doe',
            image: 'https://static.spin.com/files/2019/03/GettyImages-1130598318-1554059636-640x401.jpg',
            bio: 'some text'
          },
          {
            name: 'Elon Musk',
            image: 'https://i.redd.it/us1zz2mnv9m21.gif',
            bio: 'idk'
          },
          {
            name: 'This is a really long name.',
            image: 'http://wowslider.com/sliders/demo-81/data1/images/redkite50498.jpg',
            bio: 'testing'
          },
          {
            name: 'Steven Riegerix',
            image: 'https://media.giphy.com/media/2Y8Iq3xe121Ba3hUAM/giphy.gif',
            bio: 'I want to know if this sentence wraps.'
          },
          {
            name: 'Testing',
            image: 'https://pmcvariety.files.wordpress.com/2018/09/fortnite-s6.jpg?w=1000&h=563&crop=1',
            bio: 'nothing'
          }
        ]
      });
  }

  res.render('index2', {
    title: 'Home2'
  });
};
