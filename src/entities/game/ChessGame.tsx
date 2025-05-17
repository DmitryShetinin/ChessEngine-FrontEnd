import { Color, IBoard, Move, Position, MoveResult, ChessPiece } from "./Types";
import calculatePossibleMoves from "../../features/FigureLogic/move.tsx"


const getOppositeColor = (color: Color): Color => {
    return color === "white" ? "black" : "white";
};

type CheckChecker = (pieces: IBoard, kingPos: Position, piece: ChessPiece) => boolean;


export class ChessGame {
    private board: IBoard; // Абстракция доски
    private currentPlayer: Color = "white";
    private moveHistory: Move[] = [];
  
    constructor(initialBoard: IBoard) {
      this.board = initialBoard;
    }
  
    getBoard() : IBoard{
      return this.board;
    }

    // Основной метод для выполнения хода
    // move(from: Position, to: Position): MoveResult {
    //     const piece = this.board.getPiece(from);
    
    //     // Проверка 1: Существует ли фигура
    //     // if (!piece) {
    //     //   return { success: false, reason: "No piece at start position" };
    //     // }
    
    //     // // Проверка 2: Ход текущего игрока
    //     // if (piece.color !== this.currentPlayer) {
    //     //   return { success: false, reason: "Not your turn" };
    //     // }
    
    //     // // Проверка 3: Валидность хода
    //     // if (!this.validateMove(piece, to)) {
    //     //   return { success: false, reason: "Invalid move for this piece" };
    //     // }
    
    //     // Выполнение хода
    //     this.board.setPiece(to, piece);
    //     this.board.setPiece(from, null);
    
    //     // Обновление истории
    //     this.moveHistory.push({ from, to });
    
    //     // Проверка шаха и мата
    //     const opponentColor = getOppositeColor(this.currentPlayer);
    //     const isOpponentInCheck = this.isCheck(opponentColor);
    //    // const isCheckmate = isOpponentInCheck && this.isCheckmate(opponentColor);
    
    //     // Смена игрока
    //     this.currentPlayer = getOppositeColor(this.currentPlayer);
    
    //     return { 
    //       success: true,
          
    //       check: isOpponentInCheck,
    //       //checkmate: isCheckmate 
    //     };
    // }
  
    private isCheck = (
        playerColor: "white" | "black"
    ): boolean => {
        const kingPosition = this.findKingPosition(this.board, playerColor);
        if (!kingPosition) return false;
    
        return this.board.some((piece, position) => {
            if (!piece || piece.color === playerColor) return false;
            
            // Для пешек используем специальную проверку
            if (piece.type === 'pawn') {
                const direction = piece.color === 'white' ? -1 : 1;
                return (
                    position.row + direction === kingPosition.row &&
                    Math.abs(position.col - kingPosition.col) === 1
                );
            }
    
            // Для остальных фигур проверяем ходы
            return piece.getPossibleMoves(this.board)
                .some(move => move.row === kingPosition.row && move.col === kingPosition.col);
        });
    };

    pawnAttack: CheckChecker = (pieces, kingPos, piece) => {
        const direction = piece.color === 'white' ? -1 : 1;
        return (
            piece.position.row + direction === kingPos.row &&
            Math.abs(piece.position.col - kingPos.col) === 1
        );
    };
    
    otherPiecesAttack: CheckChecker = (pieces, kingPos, piece) => {
        const moves = calculatePossibleMoves(piece, pieces);
        return moves.some(m => m.row === kingPos.row && m.col === kingPos.col);
    };
    
    findKingPosition = (
        pieces: IBoard, 
        color: 'white' | 'black'
      ): Position | null => {
        for (let row = 0; row < 8; row++) {
          for (let col = 0; col < 8; col++) {
            const piece = pieces[row][col];
            if (piece?.type === 'king' && piece.color === color) {
              return { row, col };
            }
          }
        }
        return null;
      };
  }