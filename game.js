$(function() {
    var player = "";
    var computer = "";
    var playerTurn = "c"; //whose turn it is to move
    var squares = document.getElementsByClassName("square");
    var squareList = [];
    var occupied = [];
    var squaresClaimed = 0;
    var gameEnded;
    var board = [
        [
            [0, 1, 2], "", 0, 0
        ],
        [
            [3, 4, 5], "", 0, 0
        ],
        [
            [6, 7, 8], "", 0, 0
        ],
        [
            [0, 3, 6], "", 0, 0
        ],
        [
            [1, 4, 7], "", 0, 0
        ],
        [
            [2, 5, 8], "", 0, 0
        ],
        [
            [0, 4, 8], "", 0, 0
        ],
        [
            [6, 4, 2], "", 0, 0
        ]
    ];
    var i;

    for (i in squares) {
        squares[i].onclick = occupySquare;
        squareList.push(squares[i]);
        occupied.push(false);
    }

    var X = document.getElementById("X");
    var O = document.getElementById("O");

    X.onclick = function() {
        player = "X";
        computer = "O";
        hideQuestion();
        computerPickSquare();
    }

    O.onclick = function() {
        player = "O";
        computer = "X";
        hideQuestion();
        computerPickSquare();
    }

    function checkForWin() {
        var k;
        for (k in board) {
            if (board[k][1] === "PPP") {
                alert("You Won!");
                gameEnded = true;
                clearBoard();
            } else if (board[k][1] === "CCC") {
                alert("Computer Won!");
                gameEnded = true;
                clearBoard();
            }
        }
        if (squaresClaimed === 9) {
            alert("Tie Game");
            clearBoard();
        }
    }

    //rows,columns,or diagonals with 2 player chosen squares get first
    //priority then rows, columns,diagonals with 1 player chosen square
    //then any open row, square or diagonal
    // checks to see if any rows,columns, diagonals 2 squares chosen
    //then choose remaining square to block player
    function findMoveInRowOfTwo() {
        var n, i;
        for (n in board) {
            if (board[n][2] == 2) {
                for (i in board[n][0]) {
                    if (occupied[board[n][0][i]] === false) {
                        return board[n][0][i];
                    }
                }
            }
        }
        return undefined;
    }

    function findMoveInRowOfOne() {
        var m, k, c, b;
        // checks to see if any rows,columns, diagonals only have one square chosen
        //then choses one of two remaining squares to block player
        for (m in board) {
            var max = Math.max(board[m][0][0], board[m][0][1], board[m][0][2]);
            var min = Math.min(board[m][0][0], board[m][0][1], board[m][0][2]);
            //this is part is causing nonresponsive script
            if (board[m][2] === 1) {
                for (k in board[m][0]) { // one of two remaining spots
                    var occupiedSq;
                    if (occupied[board[m][0][k]] === true) {
                        occupiedSq = board[m][0][k];
                        // if player starts game with corner move
                        //then computer automatically plays middle square
                        if (squaresClaimed === 1) {
                            if (occupiedSq === 0 || occupiedSq === 2 || occupiedSq === 6 || occupiedSq === 8) {
                                return 4;
                            }
                        }
                        // computer plays farthest corner square from the one player chose
                        //if player choses edge square
                        if (occupiedSq === max && occupied[min] == false) {
                            return min;
                        } else if (occupiedSq === min && occupied[max] == false) {
                            return max;
                        }
                    }
                }
            }
        }
    }
    //if computer can win, computer goes for win
    function goForComputerWin() {
        var v, c;
        for (v in board) {
            if (board[v][1] === "CC") {
                for (c in board[v][0]) {
                    if (occupied[board[v][0][c]] === false) {
                        return board[v][0][c];
                    }
                }
            }
        }
        return -1;
    }

    function calcComputerMove() {
        if (squaresClaimed >= 2) {
            var win = goForComputerWin();
            if (win !== -1) {
                return win;
            }
        }
        if (squaresClaimed < 9) {
            var two = findMoveInRowOfTwo();
            if (two !== undefined) {
                return two;
            } else {
                var one = findMoveInRowOfOne();
                if (one !== undefined) {
                    return one;
                } else {
                    var last = -1;
                    while (last === -1) {
                        var num = getRandomIntInclusive(0, 8);
                        if (occupied[num] === false) {
                            last = num;
                            return last;
                        }
                    }
                }
            }
        }
    }

    function computerPickSquare() {
        while (playerTurn == "c" && !gameEnded) {
            var choice = calcComputerMove();
            //console.log("1hit");
            if (occupied[choice] === false) {
                squareList[choice].innerHTML = "<h1 class='XOs'>" + computer + "</h1>";
                occupied[choice] = true;
                markSquare(choice, "C", 3); //3 is for computer tally
                playerTurn = "p";
                break;
            }
        }
        checkForWin();
    }

    function markSquare(choice, playerMark, pos) {
        var m, o;
        for (m in board) {
            for (o in board[m][0]) {
                if (board[m][0][o] === choice) {
                    board[m][1] += playerMark;
                    board[m][pos]++;
                }
            }
        }
        squaresClaimed++;
    }

    function clearBoard() {
        var n, k;
        squaresClaimed = 0;
        for (n in squareList) {
            squareList[n].innerHTML = "<h1 class='XOs'></h1>";
            //boxTally[n] = "U";
            playerTurn = "c";
            occupied[n] = false;
        }
        for (k in board) {
            board[k][1] = "";
            board[k][2] = 0;
            board[k][3] = 0;
        }
        gameEnded = false;
        computerPickSquare();
    }

    function getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    //refactor this for use by both player and computer
    function occupySquare() {
        var order = squareList.indexOf(this);
        if (!occupied[order] && playerTurn === "p") {
            this.innerHTML = "<h1 class='XOs'>" + player + "</h1>";
            occupied[order] = true;
            //boxTally[order] = "P";
            markSquare(order, "P", 2); //2 is for player tally
            playerTurn = "c";
        }
        checkForWin(); //use callback computerPickSquare() in checkForWin
        computerPickSquare(); //replace this with callback
    }

    function hideQuestion() {
        var board = document.getElementById("theBoard");
        board.style.display = "flex";
        var questionBox = document.getElementById("questionQuery");
        questionBox.style.display = "none";
    }
});