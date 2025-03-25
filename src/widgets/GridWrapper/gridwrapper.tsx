import React from "react";
import './index.css';
import styled from 'styled-components';



const Gridcell = styled.div`
    width: 50px;
    height: 50px;
    background-color: ${props => props.color ? props.color : 'black'};
    border: 1px solid black;

`;



const gridwrapper = () => {
  
    const board: string[][] = Array(8)
        .fill(null)
        .map((_, rowIndex) =>
            Array(8)
                .fill(null)
                .map((_, colIndex) => (rowIndex + colIndex) % 2 === 0 ? 'white' : 'black')
        );

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {board.map((row, rowIndex) => (
                <div key={rowIndex} style={{ display: 'flex' }}>
                    {row.map((cellColor, colIndex) => (                
                        <Gridcell color={cellColor} key={colIndex} /> 
                    ))}
                </div>
            ))}
        </div>
    );
};

export default gridwrapper;
