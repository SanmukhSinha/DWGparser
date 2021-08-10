
/**
 * Synchronous execution of program
 */
 async function run(){

    console.log("Waiting...");
    const data = await getAndParseFile();
    fileField.classList.toggle("hide");
    
    const linesE = filterEntitiesDataByType(data,"LINE");
    const linesB = filterBlocksDataByType(data,"LINE");
    const lines = linesE.concat(linesB);

    const circlesE = filterEntitiesDataByType(data,"CIRCLE");
    const circlesB = filterBlocksDataByType(data,"CIRCLE");
    const circles = circlesE.concat(circlesB);

    const polylineE = filterEntitiesDataByType(data,"LWPOLYLINE");
    const polylineB = filterBlocksDataByType(data,"LWPOLYLINE");
    const polylines = polylineE.concat(polylineB);

    const textE = filterEntitiesDataByType(data,"TEXT");
    const textB = filterBlocksDataByType(data,"TEXT");
    const texts = textE.concat(textB);

    const mtextE = filterEntitiesDataByType(data,"MTEXT");
    const mtextB = filterBlocksDataByType(data,"MTEXT");
    const mtexts = mtextE.concat(mtextB);

    const SCALE = 1.0;
    const HEIGHTPIXI = 700;
    const WIDTHPIXI = 1400; 
    const [heightDxf,widthDxf] = getHeightWidthDxf(data);
    const scaleX = SCALE * WIDTHPIXI/widthDxf;
    const scaleY = SCALE * HEIGHTPIXI/heightDxf;
    const offsetX = data["header"]["$EXTMIN"]["x"];
    const offsetY = data["header"]["$EXTMIN"]["y"];
    
    let app = creatPixiApp(SCALE * HEIGHTPIXI,SCALE * WIDTHPIXI);
    drawManyLines(lines, app, scaleX, scaleY, offsetX, offsetY);
    drawManyCircles(circles, app, scaleX, scaleY, offsetX, offsetY);
    drawManyPolylines(polylines, app, scaleX, scaleY, offsetX, offsetY);
    drawManyTexts(texts, app, scaleX, scaleY, offsetX, offsetY);
    drawManyMTexts(mtexts, app, scaleX, scaleY, offsetX, offsetY);

}

run();