import React from 'react';
import './index.css';
 
import TurnMove from '../TurnMove/index.tsx';

const Paneltools = ({moveTurn}) => {
 
    return (
        <div class="container">
            <TurnMove moveTurn={moveTurn} />     
        </div>
    );
};


export default Paneltools;