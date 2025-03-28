import React from 'react';
import './index.css';
import { ChessPiece } from '../../entities/figure.tsx';

const pieces = {
    Rook: new ChessPiece('Rook', 'white', { row: 0, col: 0 }),
    Knight: new ChessPiece('Knight', 'white', { row: 0, col: 1 }),
    Bishop: new ChessPiece('Bishop', 'white', { row: 0, col: 2 }),
    Queen: new ChessPiece('Queen', 'white', { row: 0, col: 3 }),
  };
  

const ChoosePeaces = ({ swapPawn }) => {
    const handlePieceClick = (piece) => {
        console.log('Selected piece:', pieces[piece]);
    };

    return (
        <>
            {swapPawn && 
                <div className="chess-list">
                    <ol>
                        {Object.keys(pieces).map((piece) => (
                            <li key={piece} onClick={() => handlePieceClick(piece)}>
                                {piece}
                            </li>
                        ))}
                    </ol>
                </div>
            }
        </>
    );
};

export default ChoosePeaces;
