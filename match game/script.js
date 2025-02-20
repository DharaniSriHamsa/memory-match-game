document.addEventListener("DOMContentLoaded", () => {
    const landingPage = document.getElementById("landing");
    const gamePage = document.getElementById("game");
    const grid = document.getElementById("grid");
    const timerDisplay = document.getElementById("timer");
    const scoreDisplay = document.getElementById("score");
    const gameOverOverlay = document.getElementById("game-over-overlay");
    const gameOverMessage = document.getElementById("game-over-message");
    const highScoreDisplay = document.getElementById("high-score");
    const restartBtn = document.getElementById("restart-overlay");
    const menuBtn = document.getElementById("menu-overlay");
    const settingsPanel = document.getElementById("settings");
    const settingsBtn = document.getElementById("settings-btn");
    const applySettingsBtn = document.getElementById("apply-settings");
    const timerInput = document.getElementById("timer-input");
    const soundSelect = document.getElementById("sound");
    const darkModeSelect = document.getElementById("dark-mode");
    const bgMusic = document.getElementById("bg-music");
    const flipSound = document.getElementById("flip-sound");
    const winSound = document.getElementById("win-sound");
    const loseSound = document.getElementById("lose-sound");

    let timer;
    let timeLeft = 60;
    let score = 0;
    let flippedCards = [];
    let matchedPairs = 0;
    let cardData = [];
    let selectedCategory = "";

    // Card categories
    const categories = {
        fruits: ["🍎", "🍌", "🍉", "🍇", "🍓", "🥭", "🍍", "🍒", "🍑", "🥝"],
        animals: ["🐶", "🐱", "🐭", "🐰", "🐻", "🐵", "🦊", "🐼", "🐨", "🐯"],
        emojis: ["😀", "😂", "😍", "😎", "😡", "😭", "🤔", "😴", "🥳", "🤩"],
        planets: ["🪐", "🌍", "🌕", "⭐", "☀️", "🌑", "🌌", "🌠", "🌙", "🌎"],
        shapes: ["🔺", "🔵", "⬛", "🟦", "🟨", "🔶", "🔷", "🟥", "🟩", "🟪"],
        flags: ["🇺🇸", "🇬🇧", "🇫🇷", "🇩🇪", "🇮🇳", "🇨🇳", "🇯🇵", "🇧🇷", "🇦🇺", "🇨🇦"],
        landmarks: ["🏛️", "🗽", "🗿", "⛩️", "🏰", "🕌", "🏟️", "🏯", "🏗️", "🏭"],
        nature: ["🌞", "🌙", "🌳", "🌸", "☁️", "🌈", "⛰️", "🍂"],
        transportation: ["🚗", "🚌", "🚲", "✈️", "🚂", "🚢", "🚁", "🛴"],
        anotheremojis: ["😊", "❤️", "🌟", "🐶", "🍕", "🎈", "🏀", "🚗"],
        sports: ["⚽", "🏀", "🎾", "⚾", "🏌️", "🏈", "🏐", "🏒"],
        countries: ["🇺🇸", "🇨🇦", "🇯🇵", "🇫🇷", "🇧🇷", "🇦🇺", "🇮🇳", "🇩🇪"],
        occupations: ["👨‍⚕️", "👩‍🏫", "👨‍🍳", "👩‍🚒", "👨‍🚀", "👩‍🎨", "👨‍✈️", "👮‍♂️"],
        seasonal: ["⛄", "🎃", "🥚", "🎄", "🎆", "🏖️", "🌻", "🌧️"],
        space: ["☀️", "🌙", "⭐", "🚀", "🪐", "👩‍🚀", "☄️", "🛰️"],
        household: ["🪑", "🛋️", "🛏️", "🪞", "🕰️", "📚", "🪟", "📺"],
        music: ["🎸", "🎹", "🥁", "🎻", "🎤", "🎧", "🎵", "🎷"],
        fantasy: ["🐉", "🦄", "🏰", "🧙‍♂️", "🧚‍♀️", "🛡️", "🧜‍♀️", "🧞‍♂️"],
        vehicles: ["🚗", "🚚", "🚌", "🚂", "✈️", "🚲", "🛵", "🚤"],
        insects: ["🦋", "🐝", "🐜", "🐞", "🦗", "🐛", "🦟", "🐞"],
        clothing: ["🧢", "👕", "👖", "👗", "👟", "🧥", "🧤", "🧣"],
        holidays: ["🎄", "🎃", "🥚", "🎆", "❤️", "⛄", "🦃", "👻"],
        dinosaurs: ["🦖", "🦕", "🦖", "🦕", "🦖", "🦕", "🦖", "🦕"],
        ocean: ["🐟", "🐬", "🦈", "🐙", "🐋", "🌟", "🦀", "🐢"],
        tools: ["🔨", "🪛", "🔧", "🪚", "🪓", "🪜", "🖌️", "📏"],
        cartoons: ["🐭", "🧽", "⚡", "🐰", "🐶", "👸", "🦸‍♂️", "👧"],
      };

    // Load saved settings and high score
    const savedSettings = JSON.parse(localStorage.getItem("memoryMatchSettings")) || {
        sound: "on",
        timer: 60,
        darkMode: "off"
    };
    let highScore = localStorage.getItem("memoryMatchHighScore") || 0;
    highScoreDisplay.textContent = `High Score: ${highScore}`;

    soundSelect.value = savedSettings.sound;
    timerInput.value = savedSettings.timer;
    darkModeSelect.value = savedSettings.darkMode;

    // Apply dark mode on page load
    if (savedSettings.darkMode === "on") {
        document.body.classList.add("dark-mode");
    }

    // Play background music if sound is on
    if (savedSettings.sound === "on") {
        bgMusic.play();
    }

    // Click handlers for category buttons
    document.querySelectorAll(".category").forEach(button => {
        button.addEventListener("click", () => {
            selectedCategory = button.dataset.category;
            startGame();
        });
    });

    // Show/hide settings panel
    settingsBtn.addEventListener("click", () => {
        settingsPanel.classList.toggle("hidden");
        if (savedSettings.sound === "on") {
            flipSound.play();
        }
    });

    // Apply settings
    applySettingsBtn.addEventListener("click", () => {
        const soundSetting = soundSelect.value;
        const timerSetting = parseInt(timerInput.value) || 60;
        const darkModeSetting = darkModeSelect.value;

        // Save settings to localStorage
        localStorage.setItem("memoryMatchSettings", JSON.stringify({
            sound: soundSetting,
            timer: timerSetting,
            darkMode: darkModeSetting
        }));

        // Apply settings
        if (soundSetting === "on") {
            bgMusic.play();
        } else {
            bgMusic.pause();
        }
        timeLeft = timerSetting;
        settingsPanel.classList.add("hidden");

        // Toggle dark mode
        if (darkModeSetting === "on") {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }
    });

    function startGame() {
        landingPage.classList.add("hidden");
        gamePage.classList.remove("hidden");
        gameOverOverlay.classList.add("hidden");
        gameOverOverlay.style.display = "none";

        timeLeft = parseInt(timerInput.value) || 60;
        score = 0;
        matchedPairs = 0;
        flippedCards = [];
        scoreDisplay.textContent = "Score: 0";
        timerDisplay.textContent = `Time: ${timeLeft}s`;

        generateGrid();
        startTimer();
    }

    function generateGrid() {
        grid.innerHTML = "";
        cardData = [...categories[selectedCategory], ...categories[selectedCategory]];
        cardData.sort(() => Math.random() - 0.5);

        cardData.forEach((emoji, index) => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.dataset.index = index;
            card.innerHTML = `<span class="card-content hidden">${emoji}</span>`;

            card.addEventListener("click", () => flipCard(card));
            grid.appendChild(card);
        });
    }

    function flipCard(card) {
        if (flippedCards.length < 2 && !card.classList.contains("flipped") && !card.classList.contains("matched")) {
            card.classList.add("flipped");
            card.querySelector(".card-content").classList.remove("hidden");
            flippedCards.push(card);

            if (savedSettings.sound === "on") {
                flipSound.play();
            }

            if (flippedCards.length === 2) {
                setTimeout(checkMatch, 600);
            }
        }
    }

    function checkMatch() {
        const [card1, card2] = flippedCards;
        const index1 = card1.dataset.index;
        const index2 = card2.dataset.index;

        if (cardData[index1] === cardData[index2]) {
            card1.classList.add("matched");
            card2.classList.add("matched");
            matchedPairs++;
            score += 10;
        } else {
            card1.classList.remove("flipped");
            card2.classList.remove("flipped");
            card1.querySelector(".card-content").classList.add("hidden");
            card2.querySelector(".card-content").classList.add("hidden");
        }

        flippedCards = [];
        scoreDisplay.textContent = `Score: ${score}`;

        if (matchedPairs === cardData.length / 2) {
            endGame(true);
        }
    }

    function startTimer() {
        clearInterval(timer);
        timer = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = `Time: ${timeLeft}s`;

            if (timeLeft <= 0) {
                endGame(false);
            }
        }, 1000);
    }

    function endGame(won) {
        clearInterval(timer);
        gameOverOverlay.classList.remove("hidden");
        gameOverOverlay.style.display = "flex";

        if (savedSettings.sound === "on") {
            if (won) {
                winSound.play();
            } else {
                loseSound.play();
            }
        }

        if (won) {
            gameOverMessage.textContent = "🎉 Well Done! 🎉";
        } else {
            gameOverMessage.textContent = `⏳ Time’s Up! Your Score: ${score}`;
        }

        // Update high score
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("memoryMatchHighScore", highScore);
            highScoreDisplay.textContent = `High Score: ${highScore}`;
        }

        document.querySelectorAll(".card").forEach(card => {
            card.style.pointerEvents = "none";
        });
    }

    // Restart button functionality
    restartBtn.addEventListener("click", () => {
        gameOverOverlay.classList.add("hidden");
        gameOverOverlay.style.display = "none";
        startGame();

        document.querySelectorAll(".card").forEach(card => {
            card.style.pointerEvents = "auto";
        });
    });

    // Menu button functionality
    menuBtn.addEventListener("click", () => {
        gameOverOverlay.classList.add("hidden");
        gameOverOverlay.style.display = "none";
        gamePage.classList.add("hidden");
        landingPage.classList.remove("hidden");

        document.querySelectorAll(".card").forEach(card => {
            card.style.pointerEvents = "auto";
        });
    });
});