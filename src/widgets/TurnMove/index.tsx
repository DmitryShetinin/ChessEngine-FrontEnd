import React from 'react';
import './index.css';


const ChessTurnIndicator = ({ moveTurn }) => {
 
 

    return (
        <div class="turn-container">
            <div class={moveTurn == "black" ? "player-card white" : "player-card white active"}  id="whiteTurn">
                <div class="king-wrapper">
                    <span class="king">♔</span>
                </div>
                <span class="player-name">White's Turn</span>
            </div>

            <div class={moveTurn == "white" ? "player-card black" : "player-card black active"}  id="blackTurn">
                <div class="king-wrapper">
                    <span class="king">♚</span>
                </div>
                <span class="player-name">Black's Turn</span>
            </div>
        </div>
    );
};


export default ChessTurnIndicator;