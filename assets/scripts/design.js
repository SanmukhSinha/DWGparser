
/**
 * Creates and returns PIXI app
 * @returns Pixi app
 */
 function creatPixiApp(height, width, bgColor = '0xF2F2F2'){

  let app = new PIXI.Application({ 
      width: width,       // default: 800
      height: height,     // default: 600
      antialias: false,    // default: false
      transparent: false, // default: false
      resolution: 4      // default: 1
  });

  document.body.appendChild(app.view);
  app.renderer.backgroundColor = bgColor ;

  console.log("Created PIXI App");
  return app;

}


/**
* Draws line from given coordinates
* @param app PIXI app 
* @param color Line color in HexCode
*/
function drawLine(app, x1, y1, x2, y2, color = '0x000000'){
  let line = new PIXI.Graphics();
  line.lineStyle(0.3, color, 1);
  line.moveTo(x1, y1);
  line.lineTo(x2, y2);
  //line.x = 32;
  //line.y = 32;
  app.stage.addChild(line);
  console.log("Line drawn");
}


/**
* Draws circle from given coordinates
* @param app PIXI app 
* @param color Circle color in HexCode
*/
function drawCircle(app, x, y, rad, color = '0x000000'){
  let circle = new PIXI.Graphics();
  circle.lineStyle(2,color,1);
  //circle.beginFill('0xFFFFFFFF');
  circle.drawCircle(x, y, rad);
  //circle.endFill();
  app.stage.addChild(circle);
  console.log("Circle drawn");
}

/**
* Draws text at given coordinates
* @param app PIXI app 
* @param content Text content
* @param height Font size
* @param rotation Angle rotated in degree
*/
function drawText(app, startX, startY, height, content, rotation){
  let style = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: height,
    fill : 0x000000, 
    align : 'center'
  });

  let text = new PIXI.Text(content,style);
  text.position.set(startX,startY);
  text.angle = rotation;

  app.stage.addChild(text);
  console.log("Text added");
}

/**
* Draws mtext at given coordinates
* @param app PIXI app 
* @param height Font size
* @param content Text content
*/
function drawMText(app, startX, startY, height, content){
    let newContent = null;
    let i = 0;

    while(content[i] != ';' && i < content.length)
        i++;
    if(i < content.length)
        newContent = content.substring(i+1);

    drawText(app, startX, startY, height, newContent,0)
}


/**
* Loop for drawing all lines
* @param lines Array of line objects {..,vertices:[{x,y,z},{x,y,z}],..}
* @param app PIXI app
* @param scaleX Multiply with x coordinates
* @param scaleY Multiply with y coordinates
*/
function drawManyLines(lines, app, scaleX, scaleY, offsetX, offsetY){
  
  lines.forEach(line => {
      let startX = line["vertices"][0]["x"];
      let startY = line["vertices"][0]["y"];
      let endX = line["vertices"][1]["x"];
      let endY = line["vertices"][1]["y"];

      if(Math.min(startX,endX) >= offsetX && Math.min(startY,endY) >= offsetY){
          startX = (startX - offsetX) * scaleX;
          console.log(startX);
          startY = (startY - offsetY) * scaleY;
          console.log(startY);
          endX = (endX - offsetX) * scaleX;
          console.log(endX);
          endY = (endY - offsetY) * scaleY;
          console.log(endY);
          
          drawLine(app,startX,startY,endX,endY);
      }
  });
}

/**
* Loop for drawing all polylines
* @param polylines Array of polyline objects {..,vertices:[{x,y,z},{x,y,z}..],shape: bool,..}
* @param app PIXI app
* @param scaleX Multiply with x coordinates
* @param scaleY Multiply with y coordinates
*/
function drawManyPolylines(polylines, app, scaleX, scaleY, offsetX, offsetY){
  
  polylines.forEach(polyline => {
      const length = polyline["vertices"].length;
      for(let i = 1; i < length;i++){
          let line = new Array();
          line.push(polyline["vertices"][i-1]);
          line.push(polyline["vertices"][i]);
          line = [{"vertices":[...line]}];

          if(!("bulge" in polyline["vertices"][i-1]) && !("bulge" in polyline["vertices"][i]))
              drawManyLines(line, app, scaleX, scaleY, offsetX, offsetY);

          
      }

      let line = new Array();
      line.push(polyline["vertices"][length-1]);
      line.push(polyline["vertices"][0]);
      line = [{"vertices":[...line]}];
      if(polyline["shape"])
          if(!polyline["vertices"][0]["bulge"] && !polyline["vertices"][length-1]["bulge"])
              drawManyLines(line, app, scaleX, scaleY, offsetX, offsetY);
  });
}

/**
* Loop for drawing all circles
* @param circle Array of circle objects {..,center:{x,y,z}, radius: r,..}
* @param app PIXI app
* @param scaleX Multiply with x coordinates
* @param scaleY Multiply with y coordinates
*/
function drawManyCircles(circles, app, scaleX, scaleY, offsetX, offsetY){

  circles.forEach(circle => {
      centerX = circle["center"]["x"];
      centerY = circle["center"]["y"];
      radius = circle["radius"];

      if(centerX >= offsetX && centerY >= offsetY){
          centerX = (centerX - offsetX) * scaleX;
          centerY = (centerY - offsetY) * scaleY;
          radius = radius * scaleX;

          drawCircle(app, centerX, centerY, radius);
      }
  })
}


/**
* Loop for drawing all texts(single lined)
* @param lines Array of texts {.."startPoint":{x,y,z}, "height": n,
*                              "text": "lorem", "rotation" : r..}
* @param app PIXI app
* @param scaleX Multiply with x coordinates
* @param scaleY Multiply with y coordinates
*/
function drawManyTexts(texts, app, scaleX, scaleY, offsetX, offsetY){
  
  texts.forEach(text => {
      let startX = text["startPoint"]["x"];
      let startY = text["startPoint"]["y"];
      let height = text["textHeight"]; 
      let content = text["text"];
      let rotation = (text["rotation"])?text["rotation"]:0;

      if(startX >= offsetX && startY >= offsetY){
          startX = (startX - offsetX) * scaleX;
          startY = (startY - offsetY) * scaleY;
          height = height * (scaleX + scaleY)/2 * 1.4;
          
          drawText(app,startX,startY,height,content,rotation);
      }
  });
}

/**
* Loop for drawing all mtexts(multi lined)
* @param lines Array of texts {.."position":{x,y,z}, "height": n, "text": "lorem"..}
* @param app PIXI app
* @param scaleX Multiply with x coordinates
* @param scaleY Multiply with y coordinates
*/
function drawManyMTexts(mtexts, app, scaleX, scaleY, offsetX, offsetY){
  
  mtexts.forEach(text => {
      let startX = text["position"]["x"];
      let startY = text["position"]["y"];
      let height = text["height"]; 
      let content = text["text"];
      //let rotation = (text["rotation"])?text["rotation"]:0;

      if(startX >= offsetX && startY >= offsetY){
          startX = (startX - offsetX) * scaleX;
          startY = (startY - offsetY) * scaleY;
          height = height * (scaleX + scaleY)/2;
          
          drawMText(app,startX,startY,height,content);
      }
  });
}
