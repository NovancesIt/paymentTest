// Do not forget to store your new request module in a variable in order to use it
const mongoose = require('mongoose');

var user = "nicolas";
var password = "nicolas123";
var port = 61136;
var bddname = "cerba_test";


// useNewUrlParser ;)
var options = {
   connectTimeoutMS: 5000,
   useNewUrlParser: true,
  };

// Connect to the DB test MLAB
mongoose.connect('mongodb://'+user+':'+password+'@ds261136.mlab.com:'+port+'/'+bddname,
    options,
    function(err) {
     if (err) {
       console.log(err);
       console.log('Connexion failed')
     } else {
       console.info('succesfully connected');
     }
    }
);

// Need to complete this above
// const db = mongoose.connect(mongoURI, {
//   useNewUrlParser: true
// });

module.exports = mongoose;
