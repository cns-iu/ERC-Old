configs.scimap01 = {
    visualization: {
        disc_id: "disc_id",
        subd_id: "subd_id",

    },
    records: {
        styleEncoding: {
            size: {
                attr: "values",
                range: [1, 20],
                scaleType: "log"
            }
        }
    },
};


events.scimap01 = function(ntwrk) {
    ntwrk.Scales.rScale = d3.scale[configs.scimap01.records.styleEncoding.size.scaleType]()
        .domain(d3.extent(ntwrk.nestedRecords, function(d, i) {
            return d.values
        }))
        .range(configs.scimap01.records.styleEncoding.size.range)


    ntwrk.nestedRecords.forEach(function(d, i) {
        var currNodeG = ntwrk.SVG.underlyingNodeG.filter(".subd_id" + d.key);
        var currNode = currNodeG.selectAll("circle").attr("r", ntwrk.Scales.rScale(d.values));
    })

};



scimap01.Update = function() {
    dataprep.scimap01(scimap01);
    events.scimap01(scimap01);
}


dataprep.scimap01 = function(ntwrk) {
    var mappingJournal = journalMapping;

    var foundCount = 0; 
    var notFoundCount = 0;
    var newData = [];
    console.log(ntwrk.filteredData.records.data);
    ntwrk.filteredData.records.data.forEach(function(d, i) {
        var match = mappingJournal.records.data.filter(function(d1, i1) {
            return d1.formal_name == d["Reconciled Journal Name"]
        })

        match.forEach(function(d1, i1) {
            var newDataObj = new Object(d);
            newDataObj.subd_id = d1.subd_id;
            newData.push(newDataObj);
        })
        if (match.length > 0) {
            foundCount++;
        } else {
            notFoundCount++;
        }
    })
    console.log(underlyingScimapData)
    console.log("Found: " + foundCount);
    console.log("Not Found: " + notFoundCount);
    ntwrk.filteredData.records.data = newData;

    

    ntwrk.nestedRecords = d3.nest()
        .key(function(d, i) {
            return d.subd_id
        }).rollup(function(leaves) {
            return leaves.length
        }).entries(ntwrk.filteredData.records.data);
};

