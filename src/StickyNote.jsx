import React, { useState, useEffect } from "react";
import { Group, Rect } from "react-konva";
import { EditableText } from "./EditableText";

export function StickyNote({
    colour,
    text,
    x,
    y,
    width,
    height,
    onClick,
    onTextResize,
    onTextChange,
    selected,
    onTextClick
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [isTransforming, setIsTransforming] = useState(false);

    useEffect(() => {
        if (!selected && isEditing) {
            setIsEditing(false);
        } else if (!selected && isTransforming) {
            setIsTransforming(false);
        }
    }, [selected, isEditing, isTransforming]);

    function toggleEdit() {
        setIsEditing(!isEditing);
        onTextClick(!isEditing);
    }

    function toggleTransforming() {
        setIsTransforming(!isTransforming);
        onTextClick(!isTransforming);
    }

    return (
        <Group x={x} y={y}>

            <EditableText
                x={20}
                y={40}
                text={text}
                width={width}
                height={height}
                onResize={onTextResize}
                isEditing={isEditing}
                isTransforming={isTransforming}
                onToggleEdit={toggleEdit}
                onToggleTransform={toggleTransforming}
                onChange={onTextChange}
            />
        </Group>
    );
}
