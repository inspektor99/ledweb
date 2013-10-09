
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Led Web' });
};

exports.ledem = function(req, res){
  res.render('ledem', { title: 'Led Emulator' });
};