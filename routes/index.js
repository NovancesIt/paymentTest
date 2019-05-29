var express = require('express');
var router = express.Router();
var request = require('request');
// Here I can store my Stripe public and private keys in an object in order to re-use them when I want... Thanks to JavaScript... It is not necessary but could be usefull I case the application would get bigger and grow.
var myOwnKeys = {
  public: "pk_test_CSpGgKFrHLnkGGSAxRXM9BKm00x0nyvENg",
  private: "sk_test_P9bsJtIQUTZnP12zQskRGgdq00RxnOJTtQ"
};

// Now I need to require stripe and store the module in a variable in order to use it later in my script. I also add my private key defined just above.
var stripe = require("stripe")(myOwnKeys.private);

// var cityModel = require('../models/city');
var userModel = require('../models/user');


/* GET new home login page. */
router.get('/', function(req, res, next) {
  if (req.session.user == undefined) {
    req.session.user = [];
  }
  res.render('login')
});


/* POST sign-in route. */
router.post('/log', function(req, res, next) {
  userModel.findOne(
    {
      invoice: req.body.invoiceFromFront,
      amount: req.body.amountFromFront,
    },
    function (err, user) {
      console.log("User en recherche")
    if(user){
      console.log("User trouvé");
      req.session.user = user;
      res.render('invoice', {userList: req.session.user});
      console.log(req.session.user)
    } else {
      res.redirect('/')
    }
  });
});

/* GET new home login page. */
router.get('/logout', function(req, res, next) {
  req.session.user = null;
  res.redirect('/')
});

/* POST checkout page. */
router.post('/checkout', function (req, res, next) {

  console.log("from checkout")

  // Here I need to permute "request" (as given in the Stripe doc) to "req" (as I defined it in the parameters of my route juste above.)
  // const token = request.body.stripeToken;

  const token = req.body.stripeToken;

  // Now, I want to :
  // 1- calculate the total price in my backend to prevent any error or "hacking"
  // 2- store some information related to the order in the description part of the charge.
  // NB: there are several ways to achieve the same purpose here.

  // var totalCmdFromBackEnd = req.session.user.amount ;
  // console.log('testtesttest', req.session.user.amount);
  // var ordersReferences = [];

  // var name = req.body.stripeShippingName + " | ";
  // var fullAddress = req.body.stripeShippingAddressLine1 + " - " + req.body.stripeShippingAddressZip + " - " + req.body.stripeShippingAddressCity + " | ";
  // var ordersList = "Ref: " + ordersReferences.join(' - ');

  const charge = stripe.charges.create({
    amount: req.session.user.amount * 100,
    currency: 'eur',
    description: 'Nicolas Huguet',
    source: token,
  }).then(req.session.user);
  // BONUS: According to the Stripe documentation, I can use .then() to execute some code AFTER the execution of the charge script

  // BONUS : We could create a last view "confirm" for the user to deliver a confirmation message (OPTIONAL)
  res.render('confirm', {userList: req.session.user});
});




// // *** BONUS *** /* POST add-city page handling errors. */
// // This bonus aims at handling errors when a city is not found. The main goal is not to try to save a city which does not exist. Therefore, we need to implement a condition which tells : is there a 404 error return in the body ? To reach this step, we need to log the body when it works and when it does not work. That's how we can find that we need to use "body.cod == 404".
//
// router.post('/add-city', function(req, res, next) {
//   console.log("CITY ADDED : --->",req.body.addedCityFromFront);
//   // We are using the ES6 new concatenation syntax. You could use the ES5 method as well --> "string"+variable+"string"
//   request(`http://api.openweathermap.org/data/2.5/weather?q=${req.body.addedCityFromFront}&appid=fc07f13e149c30c7f3bc9c87c606a95f&units=metric&lang=fr`, function(error, response, body) {
//   	body = JSON.parse(body);
//     if (body.cod == '404') {
//       console.log("STEP 1 | HERE IS THE BODY ERROR --->", body)
//       cityModel.find(
//         function(err, citiesFromDataBase) {
//           console.log("STEP 2 | CITIES FOUND IN DB ---> ", citiesFromDataBase);
//           res.render('index', {
//             cityList: citiesFromDataBase
//           });
//         });
//     } else {
//       console.log("STEP 1 | HERE IS THE BODY ---> ", body)
//       // 1) Regarding citymodel, here, I want to pre-save by creating a new model in a variable called newCity
//       var newCity = new cityModel({
//         name: body.name,
//         desc: body.weather[0].description,
//         img: `http://openweathermap.org/img/w/${body.weather[0].icon}.png`,
//         temp_min: body.main.temp_min,
//         temp_max: body.main.temp_max,
//       });
//       newCity.save(
//         function(error, city) {
//           console.log("STEP 2 | CITY SAVED ---> ", city)
//           // 3) Once the city is saved, and the script is completed, I want to ask my database to give me all the cities (it will return "citiesFromDataBase" as I defined it). To do so, I can use find()
//           cityModel.find(
//             function(err, citiesFromDataBase) {
//               console.log("STEP 3 | CITIES FOUND IN DB ---> ", citiesFromDataBase);
//               res.render('index', {
//                 cityList: citiesFromDataBase,
//                 user: req.session.user
//               });
//             });
//         });
//     }
//   });
// });



/* GET delete page. */
router.get('/delete-city', function(req, res, next) {
  console.log("STEP 4 | CITY DELETED ID ---> ", req.query.id)
  cityModel.remove(
      { _id: req.query.id},
      function(error) {
        console.log("STEP 5 | CITY SUCCESSFULLY DELETED")
        cityModel.find(
          function(err, citiesFromDataBase) {
            res.render('index', {
              cityList: citiesFromDataBase,
              user: req.session.user
            });
          });
      }
  );
});



module.exports = router;
