

export class ChessPiece {
  constructor(
    public type: string,
    public color: "white" | "black",
    public position: { row: number; col: number }, // Добавлена закрывающая фигурная скобка
  ) {}
  
}


 