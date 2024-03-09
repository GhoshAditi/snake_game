const canvas = document.querySelector('.canvas');
const scoreElement = document.querySelector('.score');

//sounds
const btnClick = new Audio('click.wav');
const snakeEat = new Audio('eat.wav');
const snakeDie = new Audio('die.mp3');

let score = Number(scoreElement.textContent);

function startGame(){
    btnClick.play();
    menuSelectCont.classList.add('show-levels');
}

let randomNumX = Math.floor(Math.random()*21)+1;
let randomNumY = Math.floor(Math.random()*21)+1;

let fruitPos = {x: randomNumX, y: randomNumY};

let sBody =  [
    {x: 10, y: 11}
];

let dir = {x: 0, y: 0};

window.addEventListener('keydown', e => {
    if(e.key === 'ArrowUp'){
        if(dir.y > 0){
            dir = {x: 0, y: 1};
        } else {
            dir = {x: 0, y: -1};
        }
    } else if(e.key === 'ArrowDown'){
        if(dir.y < 0){
            dir = {x: 0, y: -1};
        } else {
            dir = {x: 0, y: 1};
        }
    } else if(e.key === 'ArrowLeft'){
        if(dir.x > 0){
            dir = {x: 1, y: 0};
        } else {
            dir = {x: -1, y: 0};
        }
    } else if(e.key === 'ArrowRight'){
        if(dir.x < 0){
            dir = {x: -1, y: 0};
        } else {
            dir = {x: 1, y: 0};
        }
    }
});

let newSegments = 0;

const expandSnake = (amount) => {
    newSegments += amount;
}

const equalPositions = (pos1, pos2) => {
    return pos1.x === pos2.x && pos1.y === pos2.y;
}

const onSnake = (position) => {
    return sBody.some(segment => {
        return equalPositions(segment, position);
    });
}

const addSegments = () => {
    for (let i = 0; i < newSegments; i++){
        sBody.push({...sBody[sBody.length - 1]});
    }

    newSegments = 0;
}

const update = () => {
    let newRandomNumX = Math.floor(Math.random()*21) + 1;
    let newRandomNumY = Math.floor(Math.random()*21) + 1;

    addSegments();
    for(let i = sBody.length - 2; i >= 0; i--) {
        sBody[i + 1] = { ...sBody[i] }
    }

    if(onSnake(fruitPos)){
        snakeEat.play();
        expandSnake(1);
        scoreElement.textContent = (score += 1);
        for(let i = 0; i <= sBody.length; i++){      
            if(fruitPos !== sBody[i]){
                fruitPos = {x: newRandomNumX, y: newRandomNumY};
            }
        }  
    }

    const gameOver = (message) => {
        snakeDie.play();
        const finalScore = scoreElement.textContent;
        const gameOverMessage = `${message} ${finalScore}`;
    
        // Get the game over screen and message element
        const gameOverScreen = document.querySelector('#game-over-screen');
        const gameOverMessageElement = document.querySelector('#game-over-message');
    
        // Update the game over message
        gameOverMessageElement.textContent = gameOverMessage;
    
        // Show the game over screen
        gameOverScreen.style.display = 'block';
    
        const playAgainButton = document.querySelector('.play-again-btn');
        playAgainButton.addEventListener('click', () => {
            window.location.reload(); // Reload the game
        });
    }
    const playAgainButton = document.querySelector('.play-again-btn');

// Check if an event listener has already been added to the button
if (!playAgainButton.hasClickListener) {
    playAgainButton.addEventListener('click', () => {
        window.location.reload(); // Reload the game
    });

    // Mark the button as having a click listener
    playAgainButton.hasClickListener = true;
}
    const collision = () => {
        let snakeHead = sBody[0];

        if( snakeHead.x > 21 || 
            snakeHead.x < 1  || 
            snakeHead.y < 1  || 
            snakeHead.y >21){
            gameOver('Game Over, you hit the edge.\nScore = ');
        } 
            
        if(sBody.length > 1 && snakeHead != sBody){
            for(let i = 2; i <= sBody.length; i++){
                if(typeof sBody[i] != 'undefined'){
                    if(snakeHead.x == sBody[i].x && snakeHead.y == sBody[i].y){
                        gameOver('Game Over, you hit yourself.\nScore = ');
                    }
                }
            }   
        }
    }

    collision();
        
    sBody[0].x += dir.x;
    sBody[0].y += dir.y;
}

const draw = (canvas) => {
    sBody.forEach(segment => {
        const snakeElement = document.createElement('div');
        const frontSnake = document.createElement('div');
        const backSnake = document.createElement('div');
        const leftSnake = document.createElement('div');
        const rightSnake = document.createElement('div');
        const topSnake = document.createElement('div');
        const bottomSnake = document.createElement('div');

        snakeElement.style.gridRowStart = segment.y;
        snakeElement.style.gridColumnStart = segment.x;

        snakeElement.classList.add('snake');
        frontSnake.classList.add('front-snake');
        backSnake.classList.add('back-snake');
        leftSnake.classList.add('left-snake');
        rightSnake.classList.add('right-snake');
        topSnake.classList.add('top-snake');
        bottomSnake.classList.add('bottom-snake');

        canvas.appendChild(snakeElement);
        snakeElement.appendChild(frontSnake);
        snakeElement.appendChild(backSnake);
        snakeElement.appendChild(leftSnake);
        snakeElement.appendChild(rightSnake);
        snakeElement.appendChild(topSnake);
        snakeElement.appendChild(bottomSnake);
    });

    const fruit = document.createElement('div');
    const frontFruit = document.createElement('div');
    const backFruit = document.createElement('div');
    const leftFruit = document.createElement('div');
    const rightFruit = document.createElement('div');
    const topFruit = document.createElement('div');
    const bottomFruit = document.createElement('div');   

    fruit.style.gridRowStart = fruitPos.y;
    fruit.style.gridColumnStart = fruitPos.x;
    
    fruit.classList.add('fruit');
    frontFruit.classList.add('front-fruit');
    backFruit.classList.add('back-fruit');
    leftFruit.classList.add('left-fruit');
    rightFruit.classList.add('right-fruit');
    topFruit.classList.add('top-fruit');
    bottomFruit.classList.add('bottom-fruit');

    canvas.appendChild(fruit);
    fruit.appendChild(frontFruit);
    fruit.appendChild(backFruit);
    fruit.appendChild(leftFruit);
    fruit.appendChild(rightFruit);
    fruit.appendChild(topFruit);
    fruit.appendChild(bottomFruit);

    if(sBody[0] == fruitPos) {
        sBody.push({x: sBody[0].x, y: sBody[0].y + 1});
    }
}

const body = document.querySelector('body');
const canvasContainer = document.querySelector('.canvas-cont');
const intro = document.querySelector('.menu');
const menuSelectCont = document.querySelector('.menu-select-cont');

function easy(){
    btnClick.play();
    let snake_speed = .15;
    const frameTime = snake_speed * 1000;

    intro.style.opacity = 0;
    menuSelectCont.style.opacity = 0;
    scoreElement.style.opacity = 1;
    body.style.background = '#fff';
    canvasContainer.classList.add('show-canvas');

    window.setInterval(function(){
        update();

        canvas.innerHTML = '';
        draw(canvas);
    }, frameTime);
}

function medium(){
    btnClick.play();
    let snake_speed = .1;
    const frameTime = snake_speed * 1000;

    intro.style.opacity = 0;
    menuSelectCont.style.opacity = 0;
    scoreElement.style.opacity = 1;
    body.style.background = '#fff';
    canvasContainer.classList.add('show-canvas');

    window.setInterval(function(){      
        update();

        canvas.innerHTML = '';
        draw(canvas);
    }, frameTime);
}

function hard(){
    btnClick.play();
    let snake_speed = .05;
    const frameTime = snake_speed * 1000;

    intro.style.opacity = 0;
    menuSelectCont.style.opacity = 0;
    scoreElement.style.opacity = 1;
    body.style.background = '#fff';
    canvasContainer.classList.add('show-canvas');

    window.setInterval(function(){      
        update();

        canvas.innerHTML = '';
        draw(canvas);
    }, frameTime);
}

  
