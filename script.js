const board = (function(){
    const gameArray = [];
    for(let i = 1; i<=3; i++){
        for(let j=1; j<=3; j++){
            let cellObject = createCell(i,j,null);
            gameArray.push(cellObject);
        }
    }
    console.log(gameArray);
    const setSymbol = function(cellId,symbol){
        let cellToSet = gameArray.find(cell => cell.cellId === cellId);
        cellToSet.symbol = symbol;
    };
    const getSymbol = function(row,col){
        let cellToGet = gameArray.find(cell => cell.row === row && cell.col === col);
        return cellToGet.symbol;
    };
    return {setSymbol,getSymbol};
})();

function createCell(row,col,symbol)
{
    const cellId = `cell${row}${col}`;
    return {row,col,symbol,cellId};
}

function createPlayer(name,symbol = null){
    return {name,symbol};
}

const gameInitialization = (function(){
    const startModal = document.querySelector("#game-start-modal");
    const startButton = document.querySelector(".start-button");
    const startGameButton = document.querySelector("#start-game");
    const player1Display = document.querySelector("#player1");
    const player2Display = document.querySelector("#player2");
    const turnIndicator = document.querySelector(".turn-indicator");


    startButton.addEventListener("click",()=>{
        startModal.showModal();
    });
    const inputPlayer1Name = document.querySelector("#game-start-modal #player-1-name");
    const inputPlayer2Name = document.querySelector("#game-start-modal #player-2-name");
    let playerX = createPlayer("","X");
    let playerO = createPlayer("","O");
    let playerXName = playerX.name;
    let playerOName = playerO.name;
    startGameButton.addEventListener("click",(event)=>{
        event.preventDefault();
        startButton.textContent = "Restart";
        startButton.addEventListener("click", ()=>{
            location.reload();
        });
        playerX.name = inputPlayer1Name.value;
        playerO.name = inputPlayer2Name.value;
        player1Display.textContent = inputPlayer1Name.value;
        player2Display.textContent = inputPlayer2Name.value;
        turnIndicator.textContent = `${inputPlayer1Name.value}'s turn`;
        startModal.close();
        gameInitialization.playerXName = playerX.name;
        gameInitialization.playerOName = playerO.name;
        grid.drawGrid();
    });
    return{playerXName,playerOName};
})();



const turnController = (function(){
    let isTurnX = true;
    const turnIndicator = document.querySelector(".turn-indicator");
    function setSymbolDisplay(cell){
        if(cell.textContent === ""){
            if(isTurnX === true){
                cell.textContent = "X";
                cell.style.color = "red";
                turnIndicator.style.color = "white";
                isTurnX = false;
                turnIndicator.textContent = `${gameInitialization.playerOName}'s turn`;
                board.setSymbol(cell.id,"X")
            }
            else{
                cell.textContent = "O";
                isTurnX=true;
                cell.style.color = "white";
                turnIndicator.style.color = "red";                
                turnIndicator.textContent = `${gameInitialization.playerXName}'s turn`;
                board.setSymbol(cell.id,"O")
            }
        }
    }
    return {setSymbolDisplay};
})();

const gameController = (function(){
    let isGameOver = false;
    function checkResult()
    {
        let rowWiseArray = [];
        let isAllFilled = true;
        let columnWiseArray = [];
        let columnString, rowString, crossArray1,crossArray2;
        let crossString1, crossString2;
        crossArray1 = [];
        crossArray2= [];
        let winner = null;
        for (let i=1; i <= 3; i++){
            rowWiseArray = [];
            columnWiseArray = [];
            for (let j=1; j<=3; j++){
                columnWiseArray.push(board.getSymbol(i,j));
                rowWiseArray.push(board.getSymbol(j,i));
                if(i===j){
                    crossArray1.push(board.getSymbol(j,i));
                }
                if(i+j===4){
                    crossArray2.push(board.getSymbol(i,j))
                }
                if(board.getSymbol(i,j) === null){
                    isAllFilled = false;
                }
            }
            columnString = columnWiseArray.join();
            rowString = rowWiseArray.join();
            if(rowString === "X,X,X" || columnString === "X,X,X"){
                winner = "X";
                isGameOver = true;
                return winner;
            }
            else if(rowString === "O,O,O" || columnString === "O,O,O"){
                winner = "O";
                isGameOver = true;
                return winner;
            }
        }
        crossString1 = crossArray1.join();
        crossString2 = crossArray2.join();
        if(crossString1 === "X,X,X" || crossString2 === "X,X,X"){
            winner = "X";
            isGameOver = true;
        }
        else if(crossString1 === "O,O,O" || crossString2 === "O,O,O"){
            winner = "O";
            isGameOver = true;
        }
        else if(isAllFilled === true){
            winner = "tie";
            isGameOver = true;
        }
        return winner;
    }
    function fetchIsGameOver(){
        return isGameOver;
    }

    return {checkResult,fetchIsGameOver};
})();

const grid = (function(){
    const finalGrid = document.querySelector(".grid-container");
    const turnIndicator = document.querySelector(".turn-indicator");
    let result;
    function drawGrid(){
        for (let i = 1; i<=3 ; i++)
        for (let j = 1; j<=3; j++)
        {
            let grid = document.createElement("div");
            grid.classList.add(`cell`);
            grid.id = `cell${i}${j}`;
            finalGrid.appendChild(grid);
        }
        const cells = document.querySelectorAll(".cell");
        cells.forEach((cell)=>{
            cell.addEventListener("click",(event)=>{
                if(event.target.textContent === "" && gameController.fetchIsGameOver() === false){
                    turnController.setSymbolDisplay(event.target);
                    result = gameController.checkResult();
                    if (result !== null){
                        turnIndicator.classList.toggle("winner");
                        turnIndicator.style.color = "rgb(5, 212, 5)";
                        if(result === "X"){
                            turnIndicator.textContent = `${gameInitialization.playerXName} has won`;
                        }
                        else if(result === "O"){
                            turnIndicator.textContent = `${gameInitialization.playerOName} has won`;
                        }
                        else if(result === "tie"){
                            turnIndicator.textContent = "Game is a Tie";
                        }
                } }
            });
        });
    }
    return {drawGrid};
})();
