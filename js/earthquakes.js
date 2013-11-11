/* earthquakes.js
    Script file for the INFO 343 Lab 7 Earthquake plotting page

    SODA data source URL: https://soda.demo.socrata.com/resource/earthquakes.json
    app token (pass as '$$app_token' query string param): Hwu90cjqyFghuAWQgannew7Oi
*/

//create a global variable namespace based on usgs.gov
//this is how JavaScript developers keep global variables
//separate from one another when mixing code from different
//sources on the same page
var gov = gov || {};
gov.usgs = gov.usgs || {};


//base data URL--additional filters may be appended (see optional steps)
//the SODA api supports the cross-origin resource sharing HTTP header
//so we should be able to request this URL from any domain via AJAX without
//having to use the JSONP technique
gov.usgs.quakesUrl = 'https://soda.demo.socrata.com/resource/earthquakes.json?$$app_token=Hwu90cjqyFghuAWQgannew7Oi';

//current earthquake dataset (array of objects, each representing an earthquake)
gov.usgs.quakes;

//reference to our google map
gov.usgs.quakesMap

//Document ready
$(function() {
	getQuakes();
}); //Document ready

//Queries server for list of recent earthquakes and plots them on a Google map.
function getQuakes() {
	//@param quakes (array) - array of objects, each represents info about a quake.
	$.getJSON(gov.usgs.quakesUrl, function(quakes) {
		gov.usgs.quakes = quakes; //Caching quakes array here	
		$('.message').html('Displaying ' + quakes.length + ' earthquakes'); //Total number of quakes
		//Create Google map object
		gov.usgs.quakesMap = new google.maps.Map($('.map-container')[0], {
	    center: new google.maps.LatLng(0,0),        //centered on 0/0 for world-wide data
	    zoom: 2,                                    //zoom level 2
	    mapTypeId: google.maps.MapTypeId.TERRAIN,   //terrain map
	    streetViewControl: false                    //no street view
		});

	    addQuakeMarkers(quakes, gov.usgs.quakesMap);		
	});
} //getQuakes


//Add quake location markers
//@param quakes (array) - array of quake data objects
//@param map (google.maps.Map) - Google map object to add marker for each quake
function addQuakeMarkers(quakes, map) {
	var quake; //current quake
	var i; //loop counter
	var infoWindow; //InfoWindow for quake
	for (i = 0; i < quakes.length; i++) {
		quake = quakes[i];
		if (quake.location) {
			//Create new marker object and assign quake latitute and longitude to new property mapMarker.
			quake.mapMarker = new google.maps.Marker({
    			map: map,
    			position: new google.maps.LatLng(quake.location.latitude, quake.location.longitude)
			});
			//Create info window for quake details	
			infoWindow = new google.maps.InfoWindow({
			    content: new Date(quake.datetime).toLocaleString() + 
			                ': magnitude ' + quake.magnitude + ' at depth of ' + 
			                quake.depth + ' meters'
			});	
			registerInfoWindow(map, quake.mapMarker, infoWindow);	
		}
	}
} //getQuakes()


//Click event handler to display current marker. Closes previous display if open.
//Closure to refer to map, marker, and infoWindow variables when registerInfoWindow is called.
//@param map (google.maps.Map) - Google map object
//@param marker (google.maps.Marker) - Google marker object indicating location of earthquake
//@param infoWindow (google.maps.InfoWindow) - Google infowindow object displaying detailed information of earthquake
function registerInfoWindow(map, marker, infoWindow) {
    google.maps.event.addListener(marker, 'click', function(){
		if (gov.usgs.iw) {
			gov.usgs.iw.close(); //Closes previous infoWindow if open.
		}
        gov.usgs.iw = infoWindow; //Store current infoWindow to close before showing next infoWindow.
        infoWindow.open(map, marker);
    });                
} //registerInfoWindow()





//AJAX Error event handler
//just alerts the user of the error
$(document).ajaxError(function(event, jqXHR, err){
    alert('Problem obtaining data: ' + jqXHR.statusText);
});

