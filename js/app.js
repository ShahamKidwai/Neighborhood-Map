var map;
var largeInfowindow;
var markers = [];
var bounds;


function populateInfoWindow(marker, infowindow){
      //Check to make sure the infowindow is not already opened on this marker.
	  if (infowindow.marker != marker){
	       infowindow.marker = marker;
		   infowindow.addListener('closeclick', function(){
		        infowindow.marker = null;
		    });
		
	    var streetViewService = new google.maps.StreetViewService();
		var radius = 50;
		
		  function getStreetView(data, status){
		  if (status == google.maps.StreetViewStatus.OK){
		     var nearStreetViewLocation = data.location.latLng;
			 var heading = google.maps.geometry.spherical.computeHeading(
			   nearStreetViewLocation, marker.position);
			   var panoramaOptions = {
			     position: nearStreetViewLocation,
				 pov:{
				   heading: heading,
				   pitch: 30
				 }
			   };
			   
			   var panorama = new google.maps.StreetViewPanorama(
			     document.getElementById('pano'), panoramaOptions);
			   } else {
			     infowindow.setContent('<div>' + marker.title + '</div>'+
				     '<div>No Street View Found</div>');
			   }
			   }
			 
			 streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
			 infowindow.open(map,marker);
		 }
}
		

 function toggleBounce(marker) {
                //Create function to animate markers when clicked
                marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() {
                    marker.setAnimation(google.maps.Animation.null);
                }, 500);
                
            }	 

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
		   marker:  ''
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
		        zoom: 13
	           });
			   
	        largeInfowindow = new google.maps.InfoWindow();
	        bounds = new google.maps.LatLngBounds();
	        // The following group uses the location array to create an array of markers to initialize. 
	        map.fitBounds(bounds);
            ko.applyBindings(new ViewModel());		
}		  
		  
		  
var locator = function(data, i) {
    var self = this;
	this.title = ko.observable(data.title);
    this.lat = ko.observable(data.location.lat);
    this.lng = ko.observable(data.location.lng);
    this.marker = new google.maps.Marker({
            map: map,
            position: data.location,
            title: data.title,
            animation: google.maps.Animation.DROP,
            id: i
          });
	
	this.marker.addListener('click', function(){
		    getdata(this)
			toggleBounce(self.marker);
		 });
	  
	  bounds.extend(this.marker.position);
    }	

     function getdata(marker){
		  var query = marker.title;
		  var msg = "no article found"
		  var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + query;
            $.ajax({
                     url: wikiUrl,
                     dataType: "jsonp",
                     success: function( response ) {
                     var wikiStr = response[1];
                     var wikipediaURL = 'https://en.wikipedia.org/wiki/' + wikiStr;
                     largeInfowindow.setContent('<div><h2>' + marker.title + '</h2></div><div id="pano"></div>'+ '<br><br><h3>'+'Wikipedia'+'</h3>'+'<a href="' + wikipediaURL + '">' + '</p><h6>' + response[2] + '</h6></a>');
                     populateInfoWindow(marker, largeInfowindow);
                     },
                      error: function(msg) {
                         console.log(msg);
                     }
                    });
	      }
	


var ViewModel = function() {
    var self = this;
	this.LocationList = ko.observableArray([]);
	this.searchLocation = ko.observable("")
	 
	 for (var i = 0 ; i < locations.length; i++ )
          {
		   self.LocationList.push(new locator(locations[i], i));
	      };
	      this.show = ko.observable(true);
		  this.currentLoc = ko.observable(this.LocationList()[0]);
		  this.toggleNav = ko.observable(true);	
		 
		  this.shownav = function(){
			self.show(true);
		}
		
		this.hidenav = function(){
		  self.show(false);
		}
		
		this.toggleNavBar = function ()
		{
		  self.toggleNav(!self.toggleNav());
		}
		
		self.filteredLocation = ko.computed(function() {
           var search = self.searchLocation().toLowerCase();
             if (!search) {
             return self.LocationList();
             } else {
                  return ko.utils.arrayFilter(self.LocationList(), function(Location) {
				    var title = Location.title().toLowerCase();      
						
                	   var matching = title.indexOf(search);
					    
					    var matchVal = null;
						if (matching != -1)
						{
                            matchVal = Location;							
						}
						
				  return matchVal;
				  
				  });
          }
        });
		
		
		
		
        this.selectedLocation = function(clickeditem){
	        self.currentLoc(clickeditem);
			var marker = self.currentLoc().marker;
            google.maps.event.trigger(marker, 'click');			
        };
     }
	