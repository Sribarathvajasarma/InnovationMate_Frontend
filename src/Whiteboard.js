import React from 'react';
import { Stage, Layer, Line, Text } from 'react-konva';
import './Whiteboard.css';
import axios from 'axios';

function downloadURI(uri, name) {
    var link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


const Whiteboard = () => {
    const [tool, setTool] = React.useState('pen');
    const [lines, setLines] = React.useState([]);
    const isDrawing = React.useRef(false);

    const handleMouseDown = (e) => {
        isDrawing.current = true;
        const pos = e.target.getStage().getPointerPosition();
        setLines([...lines, { tool, points: [pos.x, pos.y] }]);
    };

    const handleMouseMove = (e) => {
        if (!isDrawing.current) {
            return;
        }
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        let lastLine = lines[lines.length - 1];
        lastLine.points = lastLine.points.concat([point.x, point.y]);
        lines.splice(lines.length - 1, 1, lastLine);
        setLines(lines.concat());
    };

    const handleMouseUp = () => {
        isDrawing.current = false;
    };


    const width = window.innerWidth;
    const height = window.innerHeight;

    const stageRef = React.useRef(null);

    const handleExport = () => {
        const uri = stageRef.current.toDataURL();
        console.log(uri);
        downloadURI(uri, 'stage.png');

    };

    const handleSaveToDatabase = async () => {
        const uri = stageRef.current.toDataURL();
        try {
            const response = await axios.post('http://localhost:5000/image-upload/', { data: uri });
            console.log(response)
            if (response.status === 201) {
                alert('Image saved successfully');
            }
        } catch (error) {
            console.error('Failed to save image', error);
            alert('Failed to save image');
        }
    };


    return (
        <div className="container">
            <Stage
                onMouseDown={handleMouseDown}
                onMousemove={handleMouseMove}
                onMouseup={handleMouseUp}
                style={{ border: '1px solid black' }}
                width={width} height={height} ref={stageRef}
            >
                <Layer>
                    {lines.map((line, i) => (
                        <Line
                            key={i}
                            points={line.points}
                            stroke="#df4b26"
                            strokeWidth={5}
                            tension={0.5}
                            lineCap="round"
                            lineJoin="round"
                            globalCompositeOperation={
                                line.tool === 'eraser' ? 'destination-out' : 'source-over'
                            }
                        />
                    ))}
                </Layer>
            </Stage>
            <div className="select-container">
                <select
                    value={tool}
                    onChange={(e) => {
                        setTool(e.target.value);
                    }}
                >
                    <option value="pen">Pen</option>
                    <option value="eraser">Eraser</option>
                </select>
                <button onClick={handleExport}>Download Image</button>
                <button onClick={handleSaveToDatabase}>Save to project documents</button>


            </div>
        </div>
    );
};

export default Whiteboard;

