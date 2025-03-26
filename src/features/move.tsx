import { ChessPiece } from "../entities/figure";
import React from "react";



function validation(){

}

function moveDureciton(figure : ChessPiece){
    if(figure.color == 'black')
        return -1; 

    return 1; 
}


export default function calculatePossibleMoves(piece: ChessPiece, pieces: (ChessPiece | null)[][]) {
    let moves: { row: number; col: number }[] = [];
  
    switch (piece.type) {
      case 'pawn': 
        moves = calculatePawnMoves(piece, pieces);
        break;
      case 'rook':
        moves = calculateRookMoves(piece, pieces);
        break;
      case 'bishop':
        moves = calculateBishopMoves(piece, pieces);
        break;
    }
  
    return moves;


    
}



const calculatePawnMoves = (piece: ChessPiece, pieces: (ChessPiece | null)[][]) => {
    const moves: { row: number; col: number }[] = [];
    const { row, col } = piece.position;
    const direction = piece.color === 'white' ? 1 : -1;

    // Проверка базового хода
    if (row + direction >= 0 && row + direction < 8) {
        if (!pieces[row + direction][col]) {
            moves.push({ row: row + direction, col });

            // Двойной ход из начальной позиции
            if ((piece.color === 'white' && row === 1) || 
                (piece.color === 'black' && row === 6)) {
                if (row + 2 * direction >= 0 && 
                    row + 2 * direction < 8 && 
                    !pieces[row + 2 * direction][col]) {
                    moves.push({ row: row + 2 * direction, col });
                }
            }
        }
    }

    // Обработка взятий
    [-1, 1].forEach((dc) => {
        const targetRow = row + direction;
        const targetCol = col + dc;
        
        // Добавляем проверку границ массива
        if (targetRow >= 0 && targetRow < 8 && 
            targetCol >= 0 && targetCol < 8) {
            
            const targetPiece = pieces[targetRow][targetCol];
            if (targetPiece?.color !== piece.color) {
                if(pieces[targetRow][targetCol] != null)
                    moves.push({ row: targetRow, col: targetCol });
            }
        }
    });

    return moves;
};

const calculateRookMoves = (piece: ChessPiece, pieces: (ChessPiece | null)[][]) => {
    const moves: { row: number; col: number }[] = [];
    const { row, col } = piece.position;
    const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];

    directions.forEach(([dr, dc]) => {
        for (let i = 1; i < 8; i++) {
            const newRow = row + dr * i;
            const newCol = col + dc * i;
            
            if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;
            
            if (!pieces[newRow][newCol]) {
                moves.push({ row: newRow, col: newCol });
            } else {
                if (pieces[newRow][newCol]?.color !== piece.color) {
                    moves.push({ row: newRow, col: newCol });
                }
                break;
            }
        }
    });

    return moves;
};


const calculateBishopMoves = (piece: ChessPiece, pieces: (ChessPiece | null)[][]) => {
    const moves: { row: number; col: number }[] = [];
    const { row, col } = piece.position;
    const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

    directions.forEach(([dr, dc]) => {
        for (let i = 1; i < 8; i++) {
            const newRow = row + dr * i;
            const newCol = col + dc * i;
            
            if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;
            
            if (!pieces[newRow][newCol]) {
                moves.push({ row: newRow, col: newCol });
            } else {
                if (pieces[newRow][newCol]?.color !== piece.color) {
                    moves.push({ row: newRow, col: newCol });
                }
                break;
            }
        }
    });

    return moves;
};