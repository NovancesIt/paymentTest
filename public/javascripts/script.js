// alert("wsh maggle!")
// console.log(L);
console.log("script ok");
console.log(L);

var mymap = L.map('worldmap',
      {
       center: [48.866667, 2.333333],
       zoom: 4
      }
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
       attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(mymap);

      var customIcon = L.icon({
          iconUrl: '../images/leaf-green.png',
          shadowUrl: '../images/leaf-shadow.png',

          iconSize:     [38, 95],
          shadowSize:   [50, 64],

          iconAnchor:   [22, 94],
          shadowAnchor: [4, 62],

          popupAnchor:  [-3, -76]
      });

      var cities = document.getElementsByClassName('list-group-item');
      console.log(cities.length)

      for (var i = 0; i < cities.length; i++) {
        // cities name
        var name = cities[i].dataset.cityname
        console.log(name);
        // cities lon
        var lon = cities[i].dataset.lon
        console.log("lon:", lon);
        // cities lat
        var lat = cities[i].dataset.lat
        console.log("lat:", lat);
        // set a marker
        L.marker([lat, lon], {icon: customIcon}).addTo(mymap).bindPopup(name);
      }
