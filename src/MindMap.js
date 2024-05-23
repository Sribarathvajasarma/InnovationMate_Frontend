import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Text, Transformer } from 'react-konva';
import { StickyNote } from "./StickyNote";
import './MindMap.css';

const Rectangle = ({ shapeProps, isSelected, onSelect, onChange }) => {
    const shapeRef = useRef();
    const trRef = useRef();

    useEffect(() => {
        if (isSelected) {
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    }, [isSelected]);

    return (
        <React.Fragment>
            <Rect
                onClick={onSelect}
                onTap={onSelect}
                ref={shapeRef}
                {...shapeProps}
                draggable
                onDragEnd={(e) => {
                    onChange({
                        ...shapeProps,
                        x: e.target.x(),
                        y: e.target.y(),
                    });
                }}
                onTransformEnd={(e) => {
                    const node = shapeRef.current;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();

                    node.scaleX(1);
                    node.scaleY(1);
                    onChange({
                        ...shapeProps,
                        x: node.x(),
                        y: node.y(),
                        width: Math.max(5, node.width() * scaleX),
                        height: Math.max(node.height() * scaleY),
                    });
                }}
            />
            {isSelected && (
                <Transformer
                    ref={trRef}
                    flipEnabled={false}
                    boundBoxFunc={(oldBox, newBox) => {
                        if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                />
            )}
        </React.Fragment>
    );
};

const MindMap = () => {
    const [rectangles, setRectangles] = useState([]);
    const [selectedId, setSelectedId] = useState(null);

    const checkDeselect = (e) => {
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
            setSelectedId(null);
        }

        if (e.target === e.target.getStage()) {
            const updatedTexts = texts.map((text) => ({ ...text, selected: false }));
            setTexts(updatedTexts);
        }
    };

    const handleAddRectangle = () => {
        const newRect = {
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            width: 100,
            height: 100,
            fill: 'transparent',
            stroke: 'black',
            strokeWidth: 2,
            id: `rect${rectangles.length + 1}`,
        };
        setRectangles([...rectangles, newRect]);
    };

    const handleAddText = () => {
        const newText = {
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            text: 'New Text',
            fontSize: 20,
            fill: 'black',
            id: `text${rectangles.length + 1}`,
        };
        setRectangles([...rectangles, newText]);
    };


    const [texts, setTexts] = useState([]);

    const addText = () => {
        const newText = {
            id: `text${texts.length + 1}`,
            text: "Click to resize. Double click to edit.",
            x: 50 + texts.length * 20, // Adjust x position slightly to avoid overlap
            y: 50 + texts.length * 20, // Adjust y position slightly to avoid overlap
            width: 200,
            height: 200,
            selected: false,
        };
        setTexts([...texts, newText]);
    };

    const handleDeselect = (e) => {
        if (e.target === e.target.getStage()) {
            const updatedTexts = texts.map((text) => ({ ...text, selected: false }));
            setTexts(updatedTexts);
        }
    };

    const handleTextChange = (id, newText) => {
        const updatedTexts = texts.map((text) =>
            text.id === id ? { ...text, text: newText } : text
        );
        setTexts(updatedTexts);
    };

    const handleTextResize = (id, newWidth, newHeight) => {
        const updatedTexts = texts.map((text) =>
            text.id === id ? { ...text, width: newWidth, height: newHeight } : text
        );
        setTexts(updatedTexts);
    };

    const handleSelect = (id) => {
        const updatedTexts = texts.map((text) =>
            text.id === id ? { ...text, selected: true } : { ...text, selected: false }
        );
        setTexts(updatedTexts);
    };

    const buttonStyle = {
        margin: '10px',
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    };

    const containerStyle = {
        textAlign: 'center',
        marginBottom: '20px',
    };

    return (
        <div>

            <div style={containerStyle}>
                <button style={buttonStyle} onClick={handleAddRectangle}>Add Rectangle</button>
                <button style={buttonStyle} onClick={addText}>Add Text</button>
            </div>
            {/* <button className="add-rect" onClick={handleAddRectangle}>Add Rectangle</button>
            <button onClick={addText}>Add Text</button>
 */}


            <Stage
                width={window.innerWidth}
                height={window.innerHeight}
                onMouseDown={checkDeselect}
                onTouchStart={checkDeselect}
            >

                <Layer>
                    {texts.map((text) => (
                        <StickyNote
                            key={text.id}
                            x={text.x}
                            y={text.y}
                            text={text.text}
                            colour="#FFDAE1"
                            onTextChange={(value) => handleTextChange(text.id, value)}
                            width={text.width}
                            height={text.height}
                            selected={text.selected}
                            onTextResize={(newWidth, newHeight) => handleTextResize(text.id, newWidth, newHeight)}
                            onClick={() => handleSelect(text.id)}
                            onTextClick={(newSelected) => handleSelect(text.id)}
                        />
                    ))}
                    {rectangles.map((shape, i) => {
                        if (shape.text !== undefined) {
                            return (
                                <Text
                                    key={i}
                                    text={shape.text}
                                    x={shape.x}
                                    y={shape.y}
                                    fontSize={shape.fontSize}
                                    fill={shape.fill}
                                    draggable
                                    onDragEnd={(e) => {
                                        const newShapes = [...rectangles];
                                        newShapes[i] = {
                                            ...shape,
                                            x: e.target.x(),
                                            y: e.target.y(),
                                        };
                                        setRectangles(newShapes);
                                    }}
                                />
                            );
                        } else {
                            return (
                                <Rectangle
                                    key={i}
                                    shapeProps={shape}
                                    isSelected={shape.id === selectedId}
                                    onSelect={() => setSelectedId(shape.id)}
                                    onChange={(newAttrs) => {
                                        const updatedRectangles = rectangles.map((r, idx) => {
                                            if (idx === i) {
                                                return newAttrs;
                                            }
                                            return r;
                                        });
                                        setRectangles(updatedRectangles);
                                    }}
                                />
                            );
                        }
                    })}
                </Layer>
            </Stage>
        </div>
    );
};

export default MindMap;


// import React, { useState } from "react";
// import { Stage, Layer } from "react-konva";
// import { StickyNote } from "./StickyNote";


// const Text = () => {
//     const [texts, setTexts] = useState([]);

//     const addText = () => {
//         const newText = {
//             id: `text${texts.length + 1}`,
//             text: "Click to resize. Double click to edit.",
//             x: 50 + texts.length * 20, // Adjust x position slightly to avoid overlap
//             y: 50 + texts.length * 20, // Adjust y position slightly to avoid overlap
//             width: 200,
//             height: 200,
//             selected: false,
//         };
//         setTexts([...texts, newText]);
//     };

//     const handleDeselect = (e) => {
//         if (e.target === e.target.getStage()) {
//             const updatedTexts = texts.map((text) => ({ ...text, selected: false }));
//             setTexts(updatedTexts);
//         }
//     };

//     const handleTextChange = (id, newText) => {
//         const updatedTexts = texts.map((text) =>
//             text.id === id ? { ...text, text: newText } : text
//         );
//         setTexts(updatedTexts);
//     };

//     const handleTextResize = (id, newWidth, newHeight) => {
//         const updatedTexts = texts.map((text) =>
//             text.id === id ? { ...text, width: newWidth, height: newHeight } : text
//         );
//         setTexts(updatedTexts);
//     };

//     const handleSelect = (id) => {
//         const updatedTexts = texts.map((text) =>
//             text.id === id ? { ...text, selected: true } : { ...text, selected: false }
//         );
//         setTexts(updatedTexts);
//     };

//     return (
//         <div>
//             <button onClick={addText}>Add Text</button>
//             <Stage width={window.innerWidth} height={window.innerHeight} onMouseDown={handleDeselect}>
//                 <Layer>
//                     {texts.map((text) => (
//                         <StickyNote
//                             key={text.id}
//                             x={text.x}
//                             y={text.y}
//                             text={text.text}
//                             colour="#FFDAE1"
//                             onTextChange={(value) => handleTextChange(text.id, value)}
//                             width={text.width}
//                             height={text.height}
//                             selected={text.selected}
//                             onTextResize={(newWidth, newHeight) => handleTextResize(text.id, newWidth, newHeight)}
//                             onClick={() => handleSelect(text.id)}
//                             onTextClick={(newSelected) => handleSelect(text.id)}
//                         />
//                     ))}
//                 </Layer>
//             </Stage>
//         </div>
//     );
// };

// export default Text;

