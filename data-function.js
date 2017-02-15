/**
 * Created by lyonwj on 2/14/17.
 */


var driver = neo4j.v1.driver("bolt://107.23.11.130:32799", neo4j.v1.auth.basic("neo4j", "gallows-thoughts-slate"));

var session = driver.session();

var query =
    "MATCH (o:Organization) \
     RETURN o.name AS name \
     LIMIT $limit";

var initialQuery =
    "MATCH (p) WHERE id(p) = toInt($idparam) \
    MATCH (p)-[r]-(p2) \
    WITH p, collect(p2) AS ps, collect(r) AS rs \
    WITH p, extract(x IN ps | {id: id(x), name: x.name, label: labels(x)[0], loaded: false}) AS ns, extract(x IN rs | {to: id(endNode(x)), from: id(startNode(x)), id: id(x), type: type(x)}) AS ls \
    WITH [{id: id(p) , name: p.name, label: labels(p)[0], loaded: true}]+ns AS nodes,ls \
    RETURN {nodes: nodes, links: ls} AS d;";

var params = {"limit": 10};
// session.cypher({ query: query, params: params},
//     function(err, results) {
//         if (err || !results) throw err;
//         results.forEach(function(row) { console.log(row['name']) });
//     });

// session
//     .run(initialQuery, params)
//     .then(function(result){
//         console.log("QUERY RAN");
//         result.records.forEach(function(record) {
//             console.log(record);
//             console.log(record._fields);
//         });
//         // Completed!
//         session.close();
//     })
//     .catch(function(error) {
//         console.log(error);
//     });


var t = new NetChart({
    container: document.getElementById("mygraph"),
    area: { height: 900 },
    data:
        {
            dataFunction: function(nodeList, success, error){


                session.run(initialQuery, {"idparam": nodeList[0]})
                    .then(function(result) {
                       console.log("QUERY RAN");
                       result.records.forEach(function(record){
                           console.log(record);
                           success(record._fields[0]);
                       })
                    });

            }
        },
    navigation:{
        initialNodes:["912"],
        mode:"manual"
    },
    style: {
        node: {
            fillColor: "rgba(47,195,47,1)"
        },
        link: {
            fillColor: "rgba(176,220,11,0.6)"
        },
        nodeStyleFunction: nodeStyle,
        linkStyleFunction: linkStyle
    }
});

function nodeStyle(node) {
    node.label = node.data.name;

    if (node.data.label == 'Person') {
        node.fillColor = "rgba(47,195,47,1)";
    } else if (node.data.label == 'Organization') {
        node.fillColor = "rgba(195,47,47,1)"
    } else {

    }
}

function linkStyle(link) {

    if (link.hovered){
        link.radius = 5;
        link.label = link.data.type;
    }else{
        link.radius = 1;
    }


    //link.length = 2;
    //link.items = [
    //    {   // Default item places just as the regular label.
    //        text: link.data.type,
    //        padding:2,
    //        backgroundStyle: {
    //            fillColor: "rgba(86,185,247,1)",
    //            lineColor: "rgba(86,185,247,0.4)"
    //        },
    //        textStyle: {
    //            fillColor: "white"
    //        }
    //    }
    //];
}
// {
//     "nodes": [
//     {
//         "loaded": true,
//         "id": "m-13",
//         "name": "Toby"
//     },
//     {
//         "id": "m-12",
//         "name": "Bryon"
//     },
//     {
//         "id": "m-5",
//         "name": "Mark"
//     },
//     {
//         "id": "f-12",
//         "name": "Julia"
//     },
//     {
//         "id": "f-5",
//         "name": "Elisa"
//     }
// ],
//     "links": [
//     {
//         "to": "m-13",
//         "from": "m-12",
//         "id": "l35",
//         "type": "friend"
//     },
//     {
//         "to": "m-5",
//         "from": "m-13",
//         "id": "l36",
//         "type": "friend"
//     },
//     {
//         "to": "m-13",
//         "from": "f-12",
//         "id": "l133",
//         "type": "friend"
//     },
//     {
//         "to": "m-13",
//         "from": "f-5",
//         "id": "l142",
//         "type": "friend"
//     }
// ]
