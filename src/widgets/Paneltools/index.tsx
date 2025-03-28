import React from 'react';
import './index.css';
import ChoosePeaces from "../ChooseFigure/index.tsx"
import TurnMove from '../TurnMove/index.tsx';

const Paneltools = ({moveTurn, swapPawn}) => {
   
    return (
        <div class="container">
            <TurnMove moveTurn={moveTurn} />
            <ChoosePeaces swapPawn={swapPawn} />
           
        </div>
    );
};


export default Paneltools;