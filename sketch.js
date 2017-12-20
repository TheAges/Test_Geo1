var watchID,

    latitude,
    longitude,
    accuracy,
    altitude,
    altitudeAccuracy,
    heading,
    speed,

    numeroAgg = -1,
    metriTOT = 0,
    metriPrec = 0,
    veli = 0,
    tempo = 0,
    backUpPositionLat = [],
    backUpPositionLon = [],
    backUpPositionDist = [],
    backUpPositionTemp = [],

    position,
    geoLoc;

function preload() {

}

function setup() {
    createCanvas(windowWidth, windowHeight);

    getLocationUpdate()
  }


function draw() {
    tempo ++

    background("white");
    textAlign(CENTER);
    textSize(20);

    text('latitude: ' + latitude, width / 2, 30);
    text('longitude: ' + longitude, width / 2, 30 * 2);
    text('accuracy: ' + accuracy, width / 2, 30 * 3);
    text('altitude: ' + altitude, width / 2, 30 * 4);
    text('altitude accuracy: ' + altitudeAccuracy, width / 2, 30 * 5);
    text('heading: ' + heading, width / 2, 30 * 6);
    text('speed: ' + speed, width / 2, 30 * 7);

    text('Aggiornamenti: ' + numeroAgg, width / 2, 30 * 9);
    text('Distanza Totale: ' + metriTOT, width / 2, 30 * 10);
    text('Distanza Precedente: ' + metriPrec, width / 2, 30 * 11);
    text('Tempo Trascorso: ' + Math.round((tempo/60)), width / 2, 30 * 12);
    text('Velocità: ' + veli, width / 2, 30 * 13);

}



// Funzioni per chiamare getLocationUpdate() (funziona anche senza chiamere )

  function showLocation(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    accuracy = position.coords.accuracy;
    altitude = position.coords.altitude;
    altitudeAccuracy = position.coords.altitudeAccuracy;
    heading = position.coords.heading;
    speed = position.coords.speede;

    numeroAgg++

    backUpPositionLat.push(latitude);
    backUpPositionLon.push(longitude);

    metriPrec = measure(backUpPositionLat[numeroAgg],backUpPositionLon[numeroAgg],backUpPositionLat[numeroAgg-1],backUpPositionLon[numeroAgg-1])

    metriPrec = Math.round(metriPrec*100)/100

    if (numeroAgg>0) {backUpPositionDist.push(metriPrec);}
    metriTOT = backUpPositionDist.sum();

    if (numeroAgg>0) {backUpPositionTemp.push((tempo)/60);}
    veli = metriPrec/(backUpPositionTemp[numeroAgg-1]-backUpPositionTemp[numeroAgg-2])



    //alert("Latitude : " + latitude + " Longitude: " + longitude);
  }

  function errorHandler(err) {
    if (err.code == 1) {
      alert("Error: Access is denied!");
     }

    else if ( err.code == 2) {
      alert("Error: Position is unavailable!");
    }

    else if ( err.code == 3) {
      alert("Error: Timeout");
    }

    else if ( err.code == 0) {
      alert("Error: an unkown error occurred");
    }
  }

  function getLocationUpdate(){
    if(navigator.geolocation){
     // timeout at 60000 milliseconds (60 seconds)
    var options = {
     timeout:60000,
     maximumAge:10000,
     enableHighAccuracy: true};

     geoLoc = navigator.geolocation;
     watchID = geoLoc.watchPosition(showLocation, errorHandler, options);
    }

    else{
      alert("Sorry, browser does not support geolocation!");
     }


    }

    function stopWatch(){
     geoLoc.clearWatch(watchID);
    }

    function measure(lat1, lon1, lat2, lon2) {  // generally used geo measurement function
      var R = 6378.137; // Radius of earth in KM
      var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
      var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = R * c;
      return d * 1000; // meters
    }

    Array.prototype.sum = function() {

		var total = 0;

		for(var i = 0; i < this.length; i += 1) {

			total += this[i];

		}

		return total;

	};
