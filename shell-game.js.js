const cups = document.querySelectorAll('.cup');
const startButton = document.getElementById('startButton');
const message = document.getElementById('message');
const scoreElement = document.getElementById('score');
const difficultyButtons = document.querySelectorAll('.difficulty button');

let isPlaying = false;
let score = 0;
let correctCup = -1;
let difficulty = 'easy';

// Difficulty settings (number of shuffles and speed in ms)
const difficultySettings = {
    easy: { shuffles: 5, speed: 500 },
    medium: { shuffles: 10, speed: 300 },
    hard: { shuffles: 15, speed: 200 }
};

// Set up difficulty buttons
difficultyButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        difficultyButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Set difficulty
        difficulty = button.id;
    });
});

// Initialize cups
cups.forEach(cup => {
    cup.addEventListener('click', () => {
        if (!isPlaying) return;
        
        const cupIndex = parseInt(cup.id.replace('cup', ''));
        checkGuess(cupIndex);
    });
});

// Start game
startButton.addEventListener('click', () => {
    if (isPlaying) return;
    
    startGame();
});

function startGame() {
    // Reset game state
    isPlaying = true;
    cups.forEach(cup => {
        cup.classList.remove('reveal');
        cup.querySelector('.ball').style.display = 'none';
    });
    
    startButton.disabled = true;
    message.textContent = "Watch carefully...";
    
    // Show the ball under a random cup
    correctCup = Math.floor(Math.random() * cups.length);
    cups[correctCup].querySelector('.ball').style.display = 'block';
    
    // Show all cups with ball for a moment
    setTimeout(() => {
        // Hide the ball
        cups.forEach(cup => {
            cup.querySelector('.ball').style.display = 'none';
        });
        
        // Start shuffling
        shuffleCups();
    }, 1500);
}

function shuffleCups() {
    message.textContent = "Shuffling...";
    
    const settings = difficultySettings[difficulty];
    let shuffleCount = 0;
    
    const shuffle = () => {
        // Randomly select two cups to swap
        const cup1 = Math.floor(Math.random() * cups.length);
        let cup2 = Math.floor(Math.random() * cups.length);
        
        // Make sure we don't swap a cup with itself
        while (cup1 === cup2) {
            cup2 = Math.floor(Math.random() * cups.length);
        }
        
        // Swap the cups visually
        animateSwap(cup1, cup2);
        
        // Update the correct cup if needed
        if (correctCup === cup1) {
            correctCup = cup2;
        } else if (correctCup === cup2) {
            correctCup = cup1;
        }
        
        shuffleCount++;
        
        if (shuffleCount < settings.shuffles) {
            setTimeout(shuffle, settings.speed);
        } else {
            message.textContent = "Where is the ball? Click on a cup!";
            startButton.disabled = false;
        }
    };
    
    setTimeout(shuffle, 500);
}

function animateSwap(index1, index2) {
    const cup1 = document.getElementById(`cup${index1}`);
    const cup2 = document.getElementById(`cup${index2}`);
    
    // Get the positions of the cups
    const rect1 = cup1.getBoundingClientRect();
    const rect2 = cup2.getBoundingClientRect();
    
    // Calculate the distance to move
    const distance = rect2.left - rect1.left;
    
    // Animate the swap
    cup1.style.transition = `transform ${difficultySettings[difficulty].speed / 1000}s`;
    cup2.style.transition = `transform ${difficultySettings[difficulty].speed / 1000}s`;
    
    cup1.style.transform = `translateX(${distance}px)`;
    cup2.style.transform = `translateX(${-distance}px)`;
    
    // Reset after animation and actually swap the DOM elements
    setTimeout(() => {
        cup1.style.transition = '';
        cup2.style.transition = '';
        cup1.style.transform = '';
        cup2.style.transform = '';
        
        // Swap the HTML content
        const parent = cup1.parentNode;
        const cup1Next = cup1.nextSibling;
        
        if (cup2 === cup1Next) {
            parent.insertBefore(cup2, cup1);
        } else {
            const cup2Next = cup2.nextSibling;
            parent.insertBefore(cup2, cup1Next);
            parent.insertBefore(cup1, cup2Next);
        }
    }, difficultySettings[difficulty].speed);
}

function checkGuess(guessIndex) {
    isPlaying = false;
    
    // Reveal all cups
    cups.forEach(cup => {
        cup.classList.add('reveal');
    });
    
    // Show the ball under the correct cup
    cups[correctCup].querySelector('.ball').style.display = 'block';
    
    if (guessIndex === correctCup) {
        message.textContent = "Correct! You found it!";
        score++;
        scoreElement.textContent = score;
    } else {
        message.textContent = "Wrong! Try again!";
    }
    
    // Reset after a delay
    setTimeout(() => {
        cups.forEach(cup => {
            cup.classList.remove('reveal');
        });
        message.textContent = "Click Start Game to play again!";
    }, 2000);
}