var express = require('express');
var path = require('path');
var debug = require("debug");
var logger = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var expressLayouts = require('express-ejs-layouts');
var app = express();
var router = express.Router()

var moongoose = require('mongoose');
mongoose.connect('mongodb://localhost/animalshelter');


app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts)
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.listen(3000)


require("./models/animal");
var Animal = mongoose.model("Animal");

app.get("/animals", function(req, res){
    Animal.find({}, function (err, animals) {

      res.render('animals/index', { animals: animals });
    });
  })

app.get("/animals/:id", function(req, res){
  Animal.findById(req.params.id, function(err, animal){
    if (err) console.log(err);
    res.render('animals/show', {animal: animal});
  })
})

// app.post("/animals", function(req, res){
//   var animal = new Animal();
//     animal.name = animal[breed],
//     animal.breed =  req.body.breed,
//     animal.family = req.body.family,
//     animal.gender = req.body.gender,
//     animal.dob =  req.body.dob,
//     animal.foods.push({ brand: req.body.foods})
  
//   animal.save(function (err, animal) {
//     if(err){
//       res.send("something wrong happened"+ err)
//     }else{
//       res.redirect('/animals');
//     }

//   });
//   });

app.post("/animals", function(req, res){
  var animalParams = {
    name: req.body.name,
    breed: req.body.breed,
    dob: req.body.dob,
    gender: req.body.gender,
    family: req.body.family,
  }

  var animal = new Animal(animalParams);

  var food = {brand: req.body.foods};
  animal.foods.push(food);
  Animal.create(animal).then(function(saved){
    res.redirect('/animals');
  });
});
  
// router.post('/', function(req, res) {
//   var todo = {
//     title: req.body.title,
//     completed: req.body.completed ? true : false
//   };
//   Todo.create(todo).then(function(saved) {
//     res.redirect('/todos');
//   });
// });

app.get("/animals/:id/adopt", function(req, res){
  Animal.findByIdAndUpdate(req.params.id, {status: "adopted"}, function(err, animal){
    res.redirect('/animals');
  })
});

app.get("/animals/:id/abandon", function(req, res){
  Animal.findByIdAndUpdate(req.params.id, {status: "orphan"}, function(err, animal){
    res.redirect('/animals');
  })
});


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
