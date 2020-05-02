// create constant with given json data
const json = {
    pysakit: [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R'
    ],
    tiet: [
      {
        mista: 'A',
        mihin: 'B',
        kesto: 3
      },
      {
        mista: 'B',
        mihin: 'D',
        kesto: 2
      },
      {
        mista: 'D',
        mihin: 'A',
        kesto: 1
      },
      {
        mista: 'A',
        mihin: 'C',
        kesto: 1
      },
      {
        mista: 'C',
        mihin: 'D',
        kesto: 5
      },
      {
        mista: 'C',
        mihin: 'E',
        kesto: 2
      },
      {
        mista: 'E',
        mihin: 'D',
        kesto: 3
      },
      {
        mista: 'E',
        mihin: 'F',
        kesto: 1
      },
      {
        mista: 'F',
        mihin: 'G',
        kesto: 1
      },
      {
        mista: 'G',
        mihin: 'H',
        kesto: 2
      },
      {
        mista: 'H',
        mihin: 'I',
        kesto: 2
      },
      {
        mista: 'I',
        mihin: 'J',
        kesto: 1
      },
      {
        mista: 'I',
        mihin: 'G',
        kesto: 1
      },
      {
        mista: 'G',
        mihin: 'K',
        kesto: 8
      },
      {
        mista: 'K',
        mihin: 'L',
        kesto: 1
      },
      {
        mista: 'L',
        mihin: 'M',
        kesto: 1
      },
      {
        mista: 'E',
        mihin: 'M',
        kesto: 10
      },
      {
        mista: 'M',
        mihin: 'N',
        kesto: 2
      },
      {
        mista: 'N',
        mihin: 'O',
        kesto: 2
      },
      {
        mista: 'O',
        mihin: 'P',
        kesto: 2
      },
      {
        mista: 'O',
        mihin: 'Q',
        kesto: 1
      },
      {
        mista: 'P',
        mihin: 'Q',
        kesto: 2
      },
      {
        mista: 'N',
        mihin: 'Q',
        kesto: 1
      },
      {
        mista: 'Q',
        mihin: 'R',
        kesto: 5
      },
      {
        mista: 'R',
        mihin: 'N',
        kesto: 3
      },
      {
        mista: 'D',
        mihin: 'R',
        kesto: 6
      }
    ],
    linjastot: {
      keltainen: [
        'E',
        'F',
        'G',
        'K',
        'L',
        'M',
        'N'
      ],
      punainen: [
        'C',
        'D',
        'R',
        'Q',
        'N',
        'O',
        'P'
      ],
      vihreä: [
        'D',
        'B',
        'A',
        'C',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J'
      ],
      sininen: [
        'D',
        'E',
        'M',
        'N',
        'O'
      ]
    }
  }

// save input element
var inputsClone = $('#inputs').clone();

// save route element
var bestRouteClone = $('#best-route').clone();

// create array from json for vis.js to draw stops from
const stops = [];
json.pysakit.forEach(stop => {
  stops.push({id: stop, label: '<b>' + stop + '</b>'});
});

// create array from json for vis.js to draw roads from
const roads = [];
json.tiet.forEach((road,i) => {
  roads.push({id: i, from: road.mista, to: road.mihin, length: road.kesto})
})

// create an array with nodes from bus stops array
const nodes = new vis.DataSet(stops);

// create an array with edges from roads array
const edges = new vis.DataSet(roads);

// create a network
const container = document.getElementById('road-map');

// add nodes and edges
const data = {
    nodes: nodes,
    edges: edges
};

// configure the map
const options = {
    interaction:{
        dragNodes: false,
        dragView: false,
        selectConnectedEdges: false,
        zoomView: false
    },
    edges: {
        color: '#fff',
        width: 5
    },
    configure: {
      enabled: false
    },
    nodes: {
      borderWidth: 0,
      shape: 'circle',
      margin: {
        top: 10,
        left: 10
      },
      color: {
        background: '#007bff',
        hover: {
          background: '#00baff'
        }
      },
      font: {
        color: '#fff',
        face: 'Poppins',
        multi: 'html'
      },
      chosen: false
    }
};

// create the network map with vis.js
const network = new vis.Network(container, data, options);

// crete variable that tells which input is being filled in
var inputToggle = true;

// create variable that tells if calculation is already done
var calculated = false;

// define what happens when network map is clicked
network.on('click', function(properties) {
  // check if calculation has been already done and break
  if (calculated) {
    return;
  }

  // get ids of clicked node
  let ids = properties.nodes;
  let clickedNodes = nodes.get(ids);

  // check that node has been clicked and not something else
  if (clickedNodes.length != 0) {    

    // if input toggle is default manipulate from field
    if (inputToggle) {
      
      // mark node on the map as selected and unselect earlier selection
      selectNode(clickedNodes[0].id, $('#from').val());
      
      // populate from input field with selection
      $('#from').val(clickedNodes[0].id);

      // move input field focus on to-field
      $('#to').focus();

      // change toggle to other input field
      inputToggle = false;
    } else {
      
      // mark node on the map as selected and unselect earlier selection
      selectNode(clickedNodes[0].id, $('#to').val());

      // populate to input field with selection
      $('#to').val(clickedNodes[0].id);

      // move input field focus on frm-field
      $('#from').focus();

      // change toggle to other input field
      inputToggle = true;
    }
    // check if both fields are populated and enable calculate button
    if ( $('#from').val() != "" && $('#to').val() != "" ) {
      $('#calculate').prop('disabled', false);
    }
  };
});

// a function that deselects earlier node from network map and select new one
function selectNode(current, old) {
    nodes.update({
      id: current,
      borderWidth: 3,
      color: {
        background: '#00baff',
        border: '#fff'
      }
    });
    if (old.length > 0) {
      nodes.update({
        id: old,
        borderWidth: 0,
        color: {
          background: '#007bff'
        }
      });
    }
};

// record click event on route calculation button
$(document).on('click', '#calculate', function() {

  // put all possible routes to a variable
  var routes = findRoutes($('#from').val(), $('#to').val());

  // calculate routes' lengths and sort them from shortest to longest
  var shortestRoutes = calculateShortestRoute( routes );

  // mark roads with line color
  var intervalLines = markEdges(shortestRoutes[0].route);

  // input route into a table in route element
  $('#route').append($('#from').val() + ' - ' +  $('#to').val());
  intervalLines.forEach(interval => {
    $('#route-table > tbody:last-child').append('<tr><td>' + interval.line.capitalize() + '</td><td>' + interval.from + ' - ' + interval.to + '</td></tr>');
  });

  // add route length in route element
  $('#length').append(shortestRoutes[0].length);

  // show route element
  $('#best-route').show();

  // hide calculation button
  $('#calculate').hide();

  // show reset button
  $('#reset').show();

  // change toggle value to tell the route has been calculated
  calculated = true;
});

// function to capitalize first letter
String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1)
}

// function to translate line colors from json
function translateColor(color) {
  switch(color) {
    case 'keltainen':
      return 'yellow';
      break;
    case 'punainen':
      return 'red';
      break;
    case 'vihreä':
      return 'green';
      break;
    case 'sininen':
      return 'blue';
      break;
  }
};

// run reset function when button is clicked
$(document).on('click', '#reset', reset );

// function to reset network map and DOM elements to beginning state
function reset() {
  stops.forEach(stop => {
    nodes.update({
      id: stop.id,
      borderWidth: 0,
      color: {
        background: '#007bff'
      }
    });
  })
  roads.forEach(road => {
    edges.update({
      id: road.id,
      color: '#fff',
      width: 5
    });
  });
  $('#best-route').replaceWith(bestRouteClone.clone());
  $('#inputs').replaceWith(inputsClone.clone());
  calculated = false;
}

// function to find all possible routes
function findRoutes(start, end) {
  var routes = [[start]];    
  var fullRoutes = [];

  json.tiet.forEach(road => {
    updatedRoutes = [];
    routes.forEach(route => {
      updatedRoutes = updatedRoutes.concat( newRoutes(route) );
    });
    routes = Array.from(new Set(updatedRoutes.map(JSON.stringify)), JSON.parse);
    routes.forEach((element) => {
        if (element[element.length -1] === end) {
            fullRoutes.push(element);
        }
    })
  });

  
  function newRoutes(route) {
      var lastStop = route[route.length - 1];
      var nextStops = nextStops(lastStop);
      var newRoutes = [];
      nextStops.forEach(stop => {
        if (route.indexOf(stop) == -1) {
          newRoutes.push( route.concat( [ stop ] ) );
        }
      });

      function nextStops(from) {
          var nextStops = [];
      
          // Check for all lines
          var lines = Object.keys(json.linjastot);
          lines.forEach(line => {
            var stop = json.linjastot[line].indexOf(from);
            if (stop != -1) {
                var stopBefore = json.linjastot[line][stop - 1];
                var stopAfter = json.linjastot[line][stop + 1];
    
                if (typeof stopBefore != 'undefined') {
                    nextStops.push(stopBefore);
                }
    
                if (typeof stopAfter != 'undefined') {
                    nextStops.push(stopAfter);
                }

            };
          });
          return nextStops;
      }
      return newRoutes;
  }
  return fullRoutes;

}

// function that calculates route lengths and returns routes sorted from shortest to longest
function calculateShortestRoute(routes) {
    var routeLengths = [];
    routes.forEach(route => {
        var length = 0;
        for (let i = 1; i < route.length; i ++ ) {
            json.tiet.forEach(road => {
                if ((route[i-1] === road.mista && route[i] === road.mihin) || (route[i-1] === road.mihin && route[i] === road.mista)) {
                    length += road.kesto;
                }
            });
        }
        routeLengths.push({
            route: route,
            length: length
        });
    });
    routeLengths.sort((a,b) => (a.length > b.length) ? 1 : ((b.length > a.length) ? -1 : 0));
    return routeLengths;
}

// function that returns line color for each interval between stops
function getLines(stops) {
  let lines = Object.keys(json.linjastot);
  var interval;
  lines.forEach(line => {
    for (let i = 1; i < json.linjastot[line].length; i++) {
      if ((stops[0] === json.linjastot[line][i-1] && stops[1] === json.linjastot[line][i]) ||  
          (stops[1] === json.linjastot[line][i-1] && stops[0] === json.linjastot[line][i])) {
            interval = {
              from: stops[0],
              to: stops[1],
              line: line
            }
          }
    };
  });
  return interval;
}

// function to mark route edges with correct bus line color on the network map
function markEdges(route) {
  routeLines = []
  for (let i = 1; i < route.length; i++ ){
    routeLines.push( getLines([route[i-1], route[i]]) );
  }
  routeLines.forEach(interval => {
    roads.forEach(road => {
      if ( (interval.from === road.from && interval.to === road.to) || (interval.from === road.to && interval.to === road.from) ) {
        edges.update({
          id: road.id,
          color: {
              color: translateColor(interval.line)
          }
        });
      }
    });
  });
  return routeLines;
}