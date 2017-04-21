var map;
		  
var markers = [];
		  

var locations = [{
	      title: 'Houston Zoo',
		  location: {
			  lat: 29.713807,  
			  lng:-95.391498
			  },
		  marker: ''
		  },
          {
		   title: 'Houston Museum of Natural Science', 
		   location: {
			  lat: 29.721993, 
			  lng:-95.389865
			},
		   marker: ''
		  },
          {
		   title: 'Museum of Fine Arts', 
		   location: {
			   lat: 29.725605,
			   lng: -95.390539
			},
		   marker: ''
		  },
          {
			title: 'Miller Outdoor Theatre', 
		    location: {
				lat: 29.719181, 
				lng:-95.388668
		   },
		   marker: ''
		  },
          {
			title: 'Rice University', 
			location: {
				lat: 29.717394,
				lng:-95.401831
			},
			marker: ''
		  },
          {
			title: 'The Minil Collection', 
			location: {
				lat:29.73734,
				lng:-95.39851
			},
			marker: ''
		  },
          {
		    title: 'Holocaust Museum', 
			location: {
				lat:29.725153, 
				lng:-95.38566
				},
			marker: ''
		  }];

		  
 function initMap(){
	        //Constructor creates a new map - only center and zoom are required.
	            map = new google.maps.Map(document.getElementById('map'), {
	            center: {lat: 29.727029, lng: -95.389134},
		        zoom: 12
	           });
			   
	   var largeInfowindow = new google.maps.InfoWindow();
	   var bounds = new google.maps.LatLngBounds();
	  // The following group uses the location array to create an array of markers to initialize. 
	   for (var i = 0; i < locations.length; i++){
	     // Get the position from the location array.
		 var position = locations[i].location;
		 var title = locations[i].title;
		 // Create a marker per location, and put into markers array.
		 var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
          });
	     // Push the marker to our array of markers.
	     markers.push(marker);
	   
	   
		 marker.addListener('click', function(){
		    populateInfoWindow(this, largeInfowindow);
		 });
		 // Extend the boundaries of the map for each marker
		 bounds.extend(markers[i].position);
		}
	
	function populateInfoWindow(marker, infowindow){
      //Check to make sure the infowindow is not already opened on this marker.
	    if (infowindow.marker != marker){
	       infowindow.marker = marker;
		   infowindow.setContent('<div>' + marker.title + '</div>');
		   infowindow.open(map, marker);
		   infowindow.addListener('closeclick', function(){
		      infowindow.setMarker = null;
		     });  
	    }
	 } 
		map.fitBounds(bounds);

		
ko.applyBindings(new ViewModel());		
		
}		  
		  
		  
var locator = function(data) {
    this.title = ko.observable(data.title);
    this.lat = ko.observable(data.location.lat);
    this.lng = ko.observable(data.location.lng);
}	  


var ViewModel = function() {
    var self = this;
	this.LocationList = ko.observableArray([]);
	
	locations.forEach(function(locationitem){
		self.LocationList.push(new locator(locationitem));
	});

	
	
for (var i=0; i < self.LocationList().length; i++)		
{	
	location.marker = new google.maps.Marker({
		     map: map,
		     position: self.LocationList()[i].latlng,
		     animation: google.maps.Animation.DROP,
		     title: self.LocationList()[i].name,
		     draggable: true,
		     id: i
	     });
	};
}
  
		  
		  
		  
		  