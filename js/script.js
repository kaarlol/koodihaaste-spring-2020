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
      yellow: [
        'E',
        'F',
        'G',
        'K',
        'L',
        'M',
        'N'
      ],
      red: [
        'C',
        'D',
        'R',
        'Q',
        'N',
        'O',
        'P'
      ],
      green: [
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
      blue: [
        'D',
        'E',
        'M',
        'N',
        'O'
      ]
    }
  }


var inputsClone = $('#inputs').clone();
var bestRouteClone = $('#best-route').clone();

// Create array from json for vis.js to draw stops from
const stops = [];
json.pysakit.forEach(stop => {
  stops.push({id: stop, label: '<b>' + stop + '</b>'});
});

// Create array from json for vis.js to draw roads from
const roads = [];
json.tiet.forEach((road,i) => {
  roads.push({id: i, from: road.mista, to: road.mihin, length: road.kesto})
})

//console.log(json.linjastot);

// create an array with nodes from bus stops array
const nodes = new vis.DataSet(stops);

// create an array with edges from roads array
const edges = new vis.DataSet(roads);

// create a network
const container = document.getElementById('road-map');

const data = {
    nodes: nodes,
    edges: edges
};

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

const network = new vis.Network(container, data, options);

var inputToggle = true;

network.on('click', function(properties) {
  let ids = properties.nodes;
  let clickedNodes = nodes.get(ids);
  if (clickedNodes.length != 0) {    
    if (inputToggle) {
      selectNode(clickedNodes[0].id, $('#from').val());
      $('#from').val(clickedNodes[0].id);
      $('#to').focus();
      inputToggle = false;
    } else {
      selectNode(clickedNodes[0].id, $('#to').val());
      $('#to').val(clickedNodes[0].id);
      $('#from').focus();
      inputToggle = true;
    }
    if ( $('#from').val() != "" && $('#to').val() != "" ) {
      $('#calculate').prop('disabled', false);
    }
  };
});

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

$(document).on('click', '#calculate', function() {
  var routes = findRoutes($('#from').val(), $('#to').val());
  var shortestRoutes = calculateShortestRoute( routes );
  var intervalLines = markEdges(shortestRoutes[0].route);
  $('#route').append($('#from').val() + ' - ' +  $('#to').val());
  intervalLines.forEach(interval => {
    $('#route-table > tbody:last-child').append('<tr><td>' + translateColor(interval.line) + '</td><td>' + interval.from + ' - ' + interval.to + '</td></tr>');
  });
  $('#length').append(shortestRoutes[0].length);
  $('#best-route').show();
  $('#calculate').hide();
  $('#reset').show();
});

function translateColor(color) {
  switch(color) {
    case 'yellow':
      return 'Keltainen';
      break;
    case 'red':
      return 'Punainen';
      break;
    case 'green':
      return 'Vihreä';
      break;
    case 'blue':
      return 'Sininen';
      break;
  }
};

$(document).on('click', '#reset', reset );

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
}

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

function findRoutes(start, end) {
    var routes = [[start]];    
    var fullRoutes = [];

    for (let i = 0; i < json.tiet.length; i++) {
        updatedRoutes = [];
        for (let j = 0; j < routes.length; j++ ) {
            updatedRoutes = updatedRoutes.concat( newRoutes(routes[j]) );
        }
        routes = Array.from(new Set(updatedRoutes.map(JSON.stringify)), JSON.parse);
        routes.forEach((element) => {
            if (element[element.length -1] === end) {
                fullRoutes.push(element);
            }
        })
    }
    
    function newRoutes(route) {
        var lastStop = route[route.length - 1];
        var nextStops = nextStops(lastStop);
        var newRoutes = [];
        for (let i = 0; i < nextStops.length; i++) {
            if (route.indexOf(nextStops[i]) == -1) {
                newRoutes.push( route.concat( [ nextStops[i] ] ) );
            }
        }

        function nextStops(from) {
            var nextStops = [];
        
            // Check for all lines
            var lines = Object.keys(json.linjastot);
            for (let i = 0; i < lines.length; i++) {
        
                var stop = json.linjastot[lines[i]].indexOf(from);
                if (stop != -1) {
        
                    var stopBefore = json.linjastot[lines[i]][stop - 1];
                    var stopAfter = json.linjastot[lines[i]][stop + 1];
        
                    if (typeof stopBefore != 'undefined') {
                        nextStops.push(stopBefore);
                    }
        
                    if (typeof stopAfter != 'undefined') {
                        nextStops.push(stopAfter);
                    }
        
                };
            }
        
            return nextStops;
            
        }

        return newRoutes;
    }
    
    return fullRoutes;

}

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


function markEdges(route) {
  console.log(route);
  routeLines = []
  for (let i = 1; i < route.length; i++ ){
    routeLines.push( getLines([route[i-1], route[i]]) );
  }
  console.log(routeLines);
  routeLines.forEach(interval => {
    roads.forEach(road => {
      if ( (interval.from === road.from && interval.to === road.to) || (interval.from === road.to && interval.to === road.from) ) {
        edges.update({
          id: road.id,
          color: {
              color: interval.line
          }
        });
      }
    });
  });
  return routeLines;
}