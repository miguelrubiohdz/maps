var app = angular.module('mapsApp', [], function($interpolateProvider) {
  $interpolateProvider.startSymbol('<%');
  $interpolateProvider.endSymbol('%>');
});
var currentLocation = {lat:24.067718, lng:-110.2937648};
var closestPoint = {
  lat:Math.trunc(currentLocation.lat * 10000) / 10000, 
  lng:Math.trunc(currentLocation.lng * 10000) / 10000
};
var currentUser = parseInt($("#user_id").val());

app.controller('ZonesController', ['$scope','$http', function ZonesController($scope,$http) {
  $scope.map = new google.maps.Map(document.getElementById('map'), {
    center: {lat:closestPoint.lat,lng:closestPoint.lng},
    zoom: 16,
    maxZoom: 17,
    minZoom: 14,
    disableDefaultUI: true,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    mapTypeId: 'terrain',
    rotateControl: true,
    zoomControl: true,
    //tilt:45
  });
  /*if ($scope.map.getTilt()) {
    $scope.map.setTilt(45);
    console.log($scope.map.getTilt());
  }*/
  $scope.map.addListener('zoom_changed', function() {
    //console.log('Zoom: ' + $scope.map.getZoom());
    if ($scope.map.getZoom() == 17){
      $(".map-overlay").css("fontSize",14);
    }
    if ($scope.map.getZoom() == 16){
      $(".map-overlay").css("fontSize",10);
    }
    if ($scope.map.getZoom() < 16){
      $(".troops").hide();
    } else {
      $(".troops").show();
    }
  });

  $scope.zones = {};
  /*[
    {id:0,lat:24.067,lng:-110.293,user:0,selected:false,defArmy:1,attArmy:9,square:null,overlay:null},
    {id:1,lat:24.067,lng:-110.294,user:1,selected:false,defArmy:2,attArmy:8,square:null,overlay:null},
    {id:2,lat:24.067,lng:-110.292,user:0,selected:false,defArmy:3,attArmy:7,square:null,overlay:null},
    {id:3,lat:24.068,lng:-110.293,user:0,selected:false,defArmy:4,attArmy:6,square:null,overlay:null},
    {id:4,lat:24.066,lng:-110.293,user:0,selected:false,defArmy:5,attArmy:5,square:null,overlay:null},
    {id:5,lat:24.068,lng:-110.294,user:0,selected:false,defArmy:6,attArmy:4,square:null,overlay:null},
    {id:6,lat:24.066,lng:-110.294,user:0,selected:false,defArmy:7,attArmy:3,square:null,overlay:null},
    {id:7,lat:24.068,lng:-110.292,user:0,selected:false,defArmy:8,attArmy:2,square:null,overlay:null},
    {id:8,lat:24.066,lng:-110.292,user:0,selected:false,defArmy:9,attArmy:1,square:null,overlay:null},
  ];*/

  $scope.getZones = function(lat,lng, qty){
    $http.get('/zones/'+lat+'/'+lng+'/'+qty,null)
    .then(
      function(response){
        $scope.zones = response.data; 
        for (var x=0; x<$scope.zones.length; x++){
          $scope.zones[x].defTroops = 0;
          $scope.zones[x].attTroops = 0;
          $scope.zones[x].userDefTroops = 0;
          $scope.zones[x].userAttTroops = 0;
          for (var y=0; y<$scope.zones[x].troops.length; y++){
            if ($scope.zones[x].troops[y].user_id == $scope.zones[x].user_id){
              $scope.zones[x].defTroops += $scope.zones[x].troops[y].troops;
              if ($scope.zones[x].troops[y].user_id == currentUser){
                $scope.zones[x].userDefTroops = $scope.zones[x].troops[y].troops;
              }
            } else{
              $scope.zones[x].attTroops += $scope.zones[x].troops[y].troops;
              if ($scope.zones[x].troops[y].user_id == currentUser){
                $scope.zones[x].userAttTroops = $scope.zones[x].troops[y].troops;
              }
            }
          }
          //TODO add conditionals when alliance is present
        }
        console.log($scope.zones);
        $scope.drawZones();
      },
      function(error){
        console.log(error);
      });
  }; 

  $scope.selected = {};
  $scope.moveFrom, $scope.moveTo, $scope.moveQty;

  $scope.drawZones = function(){
    for(var x = 0; x < $scope.zones.length ; x++){
      if ($scope.zones[x].square != null) $scope.zones[x].square.setMap(null);
      var strokeColor = $scope.zones[x].selected ? '#000' : '#FFF';
      var fillColor = $scope.zones[x].user_id == currentUser ? 'blue' : '#FFF';
      var square = $scope.drawSquare($scope.zones[x].lat, $scope.zones[x].lng, strokeColor, fillColor);
      square.addListener('click', function() {
        $scope.selectSquare(this);
        //$scope.drawZones();
      });
      $scope.zones[x].square = square;
      var bounds = new google.maps.LatLngBounds(
            new google.maps.LatLng($scope.zones[x].lat, $scope.zones[x].lng),
            new google.maps.LatLng($scope.zones[x].lat + .001, $scope.zones[x].lng + .001));
      
      var overlay = new CustomOverlay(bounds, $scope.zones[x].defArmy, $scope.zones[x].attArmy, $scope.map, $scope.zones[x].id);
      //$scope.zones[x].overlay = overlay;
      //console.log($scope.zones[x]);
    }
  };
  
  $scope.drawSquare = function(lat, lng, stroke, fill){
    return rectangle = new google.maps.Rectangle({
      strokeColor: stroke,
      strokeOpacity: 0.5,
      strokeWeight: 2,
      fillColor: fill,
      fillOpacity: 0.25,
      clikable: true,
      map: $scope.map,
      bounds: {
        north: lat,
        west: lng,
        south: lat + .00099,
        east: lng + .00099
      }
    });
  };

  $scope.drawCircle = function(center, size, stroke, fill){
    return circle = new google.maps.Circle({
      strokeColor: stroke,
      strokeOpacity: 0.5,
      strokeWeight: 1,
      fillColor: fill,
      fillOpacity: 0.1,
      map: $scope.map,
      center: center,
      radius: size
    });
  };

  $scope.selectSquare = function(square){
    console.log(square);
    for(var x = 0; x < $scope.zones.length ; x++){
      if ($scope.zones[x].square == square){
        $scope.zones[x].selected = true;
        $scope.zones[x].square.strokeColor = '#000';
        $scope.zones[x].square.strokeOpacity = 1;
        $scope.selected = $scope.zones[x];
        //console.log($scope.zones[x]);
        $scope.$apply();
        //console.log($scope.selected);
      } else {
        $scope.zones[x].selected = false;
        $scope.zones[x].square.strokeColor = '#FFF';
        $scope.zones[x].square.strokeOpacity = .25;
      }
      $scope.zones[x].square.setMap(null);
      $scope.zones[x].square.setMap($scope.map);
    }
  };

  $scope.moveArmies = function(){
    var from = null;
    var to = null;
    for(var x = 0; x < $scope.zones.length; x++){
      if ($scope.zones[x].id == $scope.moveFrom){
        from = $scope.zones[x];
      }
      if ($scope.zones[x].id == $scope.moveTo){
        to = $scope.zones[x];
      }
      if (from != null && to != null) break;
    }
    from.defArmy -= $scope.moveQty;
    to.defArmy += $scope.moveQty;
    //$scope.$apply();
    console.log($scope.zones);
  }

  $scope.drawCircle(currentLocation, 100, 'green', 'green');
  $scope.getZones(closestPoint.lat,closestPoint.lng,5);
  
}]);  