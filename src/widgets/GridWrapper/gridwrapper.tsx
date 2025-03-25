import React from "react";
import './index.css';
import styled from 'styled-components';
import { ChessPiece } from '../../entities/figure.tsx';

const Gridcell = styled.div`
    width: 50px;
    height: 50px;
    background-color: ${props => props.color ? props.color : 'black'};
    border: 1px solid black;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    cursor: pointer;
`;

// Функция для создания начальной позиции фигур
const createInitialPieces = (): (ChessPiece | null)[][] => {
    const board: (ChessPiece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));
    
    // Расстановка основных фигур
    const pieceOrder = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
    
    // Белые фигуры
    pieceOrder.forEach((type, col) => {
        board[0][col] = new ChessPiece(type, 'white', {row: 0, col});
        board[1][col] = new ChessPiece('pawn', 'white', {row: 1, col});
    });
 
    // Черные фигуры
    pieceOrder.forEach((type, col) => {
        board[7][col] = new ChessPiece(type, 'black', {row: 7, col});
        board[6][col] = new ChessPiece('pawn', 'black', {row: 6, col});
    });
    
    return board;
};

const Gridwrapper = () => {
    const [pieces, setPieces] = React.useState<(ChessPiece | null)[][]>(createInitialPieces());
    
    const getPieceSymbol = (piece: ChessPiece) => {
        const symbols: {[key: string]: {[key: string]: string}} = {
            king: { white: '♔', black: '♚' },
            queen: { white: '♕', black: '♛' },
            rook: { white: '♖', black: '♜' },
            bishop: { white: '♗', black: '♝' },
            knight: { white: '♘', black: '♞' },
            pawn: { white: '♙', black: '♟' }
        };
        return symbols[piece.type][piece.color];
    };

    const handleCellClick = (rowIndex: number, colIndex: number) => {
        const clickedPiece = pieces[rowIndex][colIndex];
        console.log(`Кликнули по ячейке [${rowIndex}, ${colIndex}]`);
        if (clickedPiece) {
            console.log('Фигура:', getPieceSymbol(clickedPiece));
        } else {
            console.log('Ячейка пуста');
        }
    };

    const boardColors: string[][] = Array(8)
        .fill(null)
        .map((_, row) =>
            Array(8)
                .fill(null)
                .map((_, col) => (row + col) % 2 === 0 ? '#f0d9b5' : '#b58863')
        );

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {boardColors.map((row, rowIndex) => (
                <div key={rowIndex} style={{ display: 'flex' }}>
                    {row.map((cellColor, colIndex) => (
                        <Gridcell 
                            color={cellColor} 
                            key={`${rowIndex}-${colIndex}`}
                            onClick={() => handleCellClick(rowIndex, colIndex)}
                        >
                            {pieces[rowIndex][colIndex] && (
                                <div class="zxc" style={{ color: pieces[rowIndex][colIndex]?.color === 'white' ? '#fff' : '#000' }}>
                                    {getPieceSymbol(pieces[rowIndex][colIndex]!)}
                                </div>
                            )}
                        </Gridcell>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Gridwrapper;