var map;
var graphic;
var currLocation;
var watchId;
var queryTask;
var query;

  require([
      "geolocate",
  "esri/Map",
  "esri/widgets/Track",
  "esri/views/SceneView",
  "esri/geometry/Point",
  "esri/layers/FeatureLayer",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/Graphic",
  "esri/tasks/QueryTask",
  "esri/tasks/support/Query",
  "esri/Color",
  "dijit/layout/BorderContainer",
  "dijit/layout/ContentPane",
  "dojo/domReady!"
], function ( geolocate, Map, Track, SceneView, Point, FeatureLayer, SimpleMarkerSymbol, SimpleLineSymbol, Graphic, QueryTask, Query, Color, BorderContainer, ContentPane) {
        
    // geolocation simulator
    stubGeolocation();

    map = new Map({
        basemap: "satellite",
        ground: "world-elevation"
    });
    //scalebar = new dijit.Scalebar({ map: map });
    var view;
    var user;
    //if (navigator.geolocation) {
    //    navigator.geolocation.getCurrentPosition(zoomToLocation, locationError);
    //}

    var jobLayer = new FeatureLayer("https://services6.arcgis.com/tT1F0JrJ91CbQUFr/arcgis/rest/services/My_Jobs_Layer/FeatureServer/0");
    map.add(jobLayer);
    view = new SceneView({
        container: "viewDiv",  // Reference to the DOM node that will contain the view
        map: map,  // References the map object created in step 3
        scale: 5000,          // Sets the initial scale to 1:50,000,000
        center: [-73.98662, 40.709646]  // Sets the center point of view with lon/lat
    });

    var track = new Track({
        view: view,
        goToLocationEnabled: false
    });
    view.ui.add(track, "top-left");

    view.then(function () {
        //track.scale(5000);

        var prevLocation = view.center;

        track.on("track", function () {
            var location = track.graphic.geometry;

            view.goTo({
                center: location,
                tilt: 50,
                scale: 2500,
                heading: 360 - getHeading(location, prevLocation)
            });

            prevLocation = location.clone();

            //user = sessionStorage.getItem("userData");
            user = { "firstName": "Andy", "lastName": "Monplaisir", "phone": 4074331485}
            //user = JSON.parse(user);
            queryTask = new QueryTask({
                url: jobLayer.url + "/0"
            });
            query = new Query({
                returnGeometry: true,
                geometry: track.graphic.geometry,
                distance: 100,
                outFields: ["*"]
            });

            queryTask.execute(query).then(function (result) {
                dojo.forEach(result.features, function (feature) {
                    console.log(feature);
                    if (feature) {
                        var messageObj = {
                            "toNumber": user.phone, "message": feature.attributes.Company_Name + " is currently hiring for a " + feature.attributes.Job_Title
                                + " open the GradPie app to apply"};
                        var xhrArgs = {
                            url: "http://localhost:3000/send",
                            postData: messageObj,
                            handleAs: "json",
                            load: function (data) {
                                //dojo.byId("response2").innerHTML = "Message posted.";
                                console.log(data)
                            },
                            error: function (error) {
                                // We'll 404 in the demo, but that's okay.  We don't have a 'postIt' service on the
                                // docs server.
                                //dojo.byId("response2").innerHTML = "Message posted.";
                                console.log(error);
                            }
                        };

                        var deferred = dojo.xhrPost(xhrArgs);
                        //xhr.open("POST", "http://localhost:55711/send");
                        //xhr.send(messageObj);
                        //xhr.responseText;

                    }

                });
            }).otherwise(function (error) {
                console.error("Uh oh" + error);
            });

        });

        track.start();

        //track.on("track", sendTextMessage);
    });

    //zoomToLocation();

    function locationError(error) {
        //error occurred so stop watchPosition
        if (navigator.geolocation) {
            navigator.geolocation.clearWatch(watchId);
        }
        switch (error.code) {
            case error.PERMISSION_DENIED:
                alert("Location not provided");
                break;

            case error.POSITION_UNAVAILABLE:
                alert("Current location not available");
                break;

            case error.TIMEOUT:
                alert("Timeout");
                break;

            default:
                alert("unknown error");
                break;
        }
    }
    function zoomToLocation(location) {
        if (location) {


        }
        else {
            view = new SceneView({
                container: "viewDiv",  // Reference to the DOM node that will contain the view
                map: map,  // References the map object created in step 3
                scale: 50000000,          // Sets the initial scale to 1:50,000,000
                center: [-101.17, 21.78]  // Sets the center point of view with lon/lat
            });
        }

        //var pt = new Point(location.coords.longitude, location.coords.latitude);
        //addGraphic(pt);
        //map.centerAndZoom(pt, 12);
    }

    function getHeading(point, oldPoint) {
        // get angle between two points
        var angleInDegrees = Math.atan2(point.y - oldPoint.y, point.x -
            oldPoint.x) * 180 /
          Math.PI;

        // move heading north
        return -90 + angleInDegrees;
    }

    function sendTextMessage() {
        //var mapWidth = view.extent;

        ////Divide width in map units by width in pixels
        //var pixelWidth = mapWidth / map.width;

        ////Calculate a 10 pixel envelope width (5 pixel tolerance on each side)
        //var tolerance = 10 * pixelWidth;

        var queryExtent = new esri.geometry.Extent(1, 1, 20, 20, evt.mapPoint.spatialReference);
    }
    function showLocation(location) {
        //zoom to the users location and add a graphic
        var pt = new Point(location.coords.longitude, location.coords.latitude);
        if (!graphic) {
            addGraphic(pt);
        } else { // move the graphic if it already exists
            graphic.setGeometry(pt);
        }
        //map.centerAt(pt);
    }
    function addGraphic(pt) {
        var symbol = new SimpleMarkerSymbol(
          SimpleMarkerSymbol.STYLE_CIRCLE,
          12,
          new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_SOLID,
            new Color([210, 105, 30, 0.5]),
            8
          ),
          new Color([210, 105, 30, 0.9])
        );
        graphic = new Graphic(pt, symbol);
        view.graphics.add(graphic);
    }


    function stubGeolocation() {
        var coords = [
          {
              lat: 40.710432,
              lng: -73.984728
          },
          {
              lng: -73.984779,
              lat: 40.711472
          },
          {
              lng: -73.984919,
              lat: 40.712386
          },
          {
              lng: -73.985233,
              lat: 40.713758
          },
          {
              lng: -73.986166,
              lat: 40.713669
          },
          {
              lng: -73.986906,
              lat: 40.713620
          },
          {
              lng: -73.986928,
              lat: 40.713043
          },
          {
              lng: -73.986863,
              lat: 40.712319
          },
          {
              lng: -73.986756,
              lat: 40.711546
          },
          {
              lat: 40.710985,
              lng: -73.986681
          },
          {
              lat: 40.710465,
              lng: -73.986606
          },
          {
              lng: -73.986509,
              lat: 40.710131
          },
          {
              lng: -73.986467,
              lat: 40.709790
          }
          ],
          currentCoordIndex = 0;

        geolocate.use();

        setInterval(function () {
            geolocate.change(coords[currentCoordIndex]);
            currentCoordIndex = (currentCoordIndex + 1) % coords.length;
        }, 1500);

    }

});

function orientationChanged() {
    if (view) {
        view.reposition();
        view.resize();
    }
}