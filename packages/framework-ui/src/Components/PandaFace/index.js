import React from 'react';
import { isNil, clone } from 'ramda';
import './panda.scss';

const inputsPos = [[1, 8], [0, 11]];
const inputOffset = [{ x: 127, y: 90 }, { x: 127, y: 115 }]; // x for half lenth of input, y for distance from panda face

function pandaFace({ handsUp, inputNum, charNum, seeking, cursorPosition }) {
     let positionIrisLeft;
     let positionIrisRight;
     if (!isNil(inputNum)) {
          const pos = inputOffset[inputNum];
          const xIn = pos.x;
          const yIn = pos.y + 55;
          const maxAngle = Math.tan(xIn / yIn);
          const xInChar = xIn - cursorPosition;

          let myAngle;
          if (cursorPosition < xIn) {
               myAngle = maxAngle - Math.tan(xInChar / yIn);
          } else {
               myAngle = maxAngle + Math.tan(Math.abs(xInChar) / yIn);
          }

          const r = 6;
          const pi = Math.PI;
          const theta = { left: 1.7 * pi - (pi / 180) * 20, right: 1.7 * pi }; // default angle from iris
          const [x0, y0] = inputsPos[inputNum];

          const position1 = {
               x: x0 + r * Math.sin(theta.left + myAngle),
               y: y0 + r * Math.cos(theta.left + myAngle)
          };

          const position2 = [x0 + r * Math.sin(theta.right + myAngle)];
          position2[1] = y0 + r * Math.cos(theta.right + myAngle);

          positionIrisRight = {
               transform: 'translate(' + position1.x + 'px,' + position1.y + 'px)'
          };
          positionIrisRight.transform += ' rotate(20deg)';
          positionIrisLeft = {
               transform: 'translate(' + position2[0] + 'px,' + position2[1] + 'px)'
          };
          positionIrisLeft.transform += ' rotate(-20deg)';
     }

     return (
          <div className="window">
               <div className={'panda' + (handsUp ? ' handsUp' : '') + (seeking ? ' seeking' : '')}>
                    <div className="ears">
                         <div className="leftEar" />
                         <div className="rightEar" />
                    </div>
                    <div className="head">
                         <div className="eyes">
                              <div className="leftEye">
                                   <div className="irisEye" style={positionIrisLeft} />
                              </div>
                              <div className="rightEye">
                                   <div className="irisEye" style={positionIrisRight} />
                              </div>
                         </div>
                         <div className="face">
                              <div className="nose">
                                   <div className="lineDown" />
                              </div>
                              <div className="mouth">
                                   <div className="line" />
                              </div>
                         </div>
                    </div>
                    <div className="hands" />
               </div>
          </div>
     );
}

export default pandaFace;
