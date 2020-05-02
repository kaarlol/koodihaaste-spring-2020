json = {
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


pysakit = [];
for (let i = 0; i < json.pysakit.length; i++) {
    pysakit.push({id: json.pysakit[i], label: json.pysakit[i]});
} 

tiet = [];
for (let i = 0; i < json.tiet.length; i++) {
    tiet.push({id: i, from: json.tiet[i].mista, to: json.tiet[i].mihin, length: json.tiet[i].kesto})
}

//console.log(pysakit);
//console.log(tiet);
//console.log(json.linjastot);

// create an array with nodes
var nodes = new vis.DataSet(pysakit);

// create an array with edges
var edges = new vis.DataSet(tiet);

// create a network
var container = document.getElementById('mynetwork');

var data = {
    nodes: nodes,
    edges: edges
};

var options = {
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
        background: '#007bff'
      },
      font: {
        color: '#fff'
      }
    }
};

var network = new vis.Network(container, data, options);
var state = "from";
var destinations = {
    from: "",
    to: ""
}

network.on('click', function(properties) {
    var ids = properties.nodes;
    var clickedNodes = nodes.get(ids);
    //console.log('clicked nodes:', clickedNodes);
    if (clickedNodes.length != 0) {
        switch (state) {
            case "from":
                $('#from').val(clickedNodes[0].id);
                destinations.from = clickedNodes[0].id;
                state = "to";
                $('#message').html('Valitse määränpää');
                break;
            case "to":
                $('#to').val(clickedNodes[0].id);
                destinations.to = clickedNodes[0].id;
                state = "from";
                network.selectNodes([destinations.from, destinations.to], false);
                break;
        }
    }
    
});


var routes = findRoutes(destinations.from, destinations.to);
var shortestRoutes = calculateShortestRoute( routes );

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


/* Mark edges
for (j = 0; j < tiet.length; j++) {
    // Check earlier stop
    if ((tiet[j].from == from && tiet[j].to == stopBefore) || (tiet[j].from == stopBefore && tiet[j].to == from)) {
        
        edges.update({
            id: tiet[j].id,
            color: {
                color: lines[i]
            }
        });
    }

    // Check next stop
    if ((tiet[j].from == from && tiet[j].to == stopAfter) || (tiet[j].from == stopAfter && tiet[j].to == from)) {
        edges.update({
            id: tiet[j].id,
            color: {
                color: lines[i]
            }
        });
    }
}
*/