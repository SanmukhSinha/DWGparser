//input dxf file from user
const fileField = document.getElementById("file-field");

/**
 * Returns converted dxf file to JSON object
 * @returns promise object
 */
function getAndParseFile() {
    return new Promise(resolve => {
        fileField.onchange = function() {
            let reader = new FileReader();
            reader.readAsText(this.files[0]);

            reader.onload = function(e) {
                let fileText = e.target.result;
                let parser = new DxfParser();
                let dxf = null;
                try {
                    dxf = parser.parseSync(fileText);
                } catch(err) {
                    return console.error(err.stack);
                }
                console.log('Success!');
                resolve(dxf);//object returned
            };
        };
    });
}


/**
 * Returns height and width of cad layout
 * @param data Object containing dxf data
 * @returns [height,width]
 */
function getHeightWidthDxf(data){

    const max = data["header"]["$EXTMAX"];
    const min = data["header"]["$EXTMIN"];
    const width  = max["x"] - min["x"];
    const height = max["y"] - min["y"];
    const dim = [height,width];

    console.log("Got dxf dimensions")
    return dim;
}

/**
 * Filters data by type. 
 * @param entities Array containing entities data
 * @param type String of entity type
 * @param minX Minimum x coordinate allowed
 * @param minY Minimum y coordinate allowed
 * @returns array
 */
function filterDataByType(entities,type){
    const filteredData = new Array();

    entities.forEach(element => {
        if (element["type"] == type && !element["inPaperSpace"] && element["layer"]!="0") {
            filteredData.push(element);
        }
    });

    console.log(`Filtered by ${type}`);
    return filteredData;
}


/**
 * Filter blocks data by type
 * @param data Object containg dxf data
 * @param type String of entity type
 * @returns array
 */
function filterBlocksDataByType(data, type){
    let filteredData = new Array();

    for(let block in data["blocks"]){
        if(data["blocks"][block]["entities"]){
            filteredData = filteredData.concat(filterDataByType(data["blocks"][block]["entities"], type));
        }
    }
    return filteredData;
}

/**
 * Filter entities data by type
 * @param data Object containg dxf data
 * @param type String of entity type
 * @returns array
 */
function filterEntitiesDataByType(data, type){

    return filterDataByType(data["entities"], type);
    
}
