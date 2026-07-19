const Game = (function() {
    let currentLevel = 1;
    let cars = [];
    let moves = 0;
    let coins = 2500;
    let hints = 5;
    let unlockedLevels = [1];
    let isDragging = false;
    let draggedCar = null;
    let dragStartPos = { x: 0, y: 0 };
    let carStartPos = { x: 0, y: 0 };
    let cellSize = 57.33;
    let boardPadding = 8;
    let gridSize = 6;
    let exitRow = 2;

    let selectedCarIndex = 0;
    let isCarActive = false;
    let gamepadConnected = false;
    let lastButtonStates = {};
    let lastDpadStates = { up: false, down: false, left: false, right: false };
    let moveCooldown = 0;
    const MOVE_COOLDOWN_MS = 150;
    const STICK_DEADZONE = 0.5;

    let modalSelectedIndex = 1;
    const MODAL_BUTTONS = ['replayBtn', 'nextLevelBtn'];

    const gameBoard = document.getElementById('gameBoard');
    const coinsEl = document.getElementById('coins');
    const hintCountEl = document.getElementById('hintCount');
    const levelTextEl = document.getElementById('levelText');
    const winModal = document.getElementById('winModal');
    const winMovesEl = document.getElementById('winMoves');
    const levelModal = document.getElementById('levelModal');
    const levelGrid = document.getElementById('levelGrid');
    const gamepadHint = document.getElementById('gamepadHint');

    function init() {
        loadProgress();
        setupEventListeners();
        setupGamepadListeners();
        loadLevel(currentLevel);
        gameLoop();
    }

    function loadProgress() {
        const saved = localStorage.getItem('carGameProgress');
        if (saved) {
            const data = JSON.parse(saved);
            coins = data.coins || 2500;
            hints = data.hints || 5;
            unlockedLevels = data.unlockedLevels || [1];
            currentLevel = data.currentLevel || 1;
        }
        updateUI();
    }

    function saveProgress() {
        localStorage.setItem('carGameProgress', JSON.stringify({
            coins,
            hints,
            unlockedLevels,
            currentLevel
        }));
    }

    function updateUI() {
        coinsEl.textContent = coins;
        hintCountEl.textContent = hints;
        levelTextEl.textContent = `第${currentLevel}关`;
    }

    function loadLevel(levelId) {
        const level = LEVELS.find(l => l.id === levelId);
        if (!level) return;

        currentLevel = levelId;
        gridSize = level.gridSize;
        exitRow = level.exitRow;
        moves = 0;
        cars = level.cars.map(car => ({ ...car }));
        selectedCarIndex = 0;
        isCarActive = false;
        
        updateUI();
        calculateCellSize();
        renderBoard();
        updateSelectionVisual();
        saveProgress();
    }

    function calculateCellSize() {
        const boardWidth = gameBoard.clientWidth - boardPadding * 2;
        cellSize = boardWidth / gridSize;
    }

    function renderBoard() {
        gameBoard.innerHTML = '';
        
        cars.forEach((car, index) => {
            const carEl = document.createElement('div');
            carEl.className = `car ${car.direction} ${car.color} ${car.isTarget ? 'target-car' : ''}`;
            carEl.dataset.id = car.id;
            carEl.dataset.index = index;
            
            updateCarPosition(carEl, car);
            
            carEl.addEventListener('mousedown', startDrag);
            carEl.addEventListener('touchstart', startDrag, { passive: false });
            
            gameBoard.appendChild(carEl);
        });
    }

    function updateCarPosition(carEl, car) {
        const x = boardPadding + car.x * cellSize;
        const y = boardPadding + car.y * cellSize;
        
        if (car.direction === 'horizontal') {
            carEl.style.width = `${cellSize * car.length - 8}px`;
            carEl.style.left = `${x + 4}px`;
            carEl.style.top = `${y + 4}px`;
        } else {
            carEl.style.height = `${cellSize * car.length - 8}px`;
            carEl.style.left = `${x + 4}px`;
            carEl.style.top = `${y + 4}px`;
        }
    }

    function updateSelectionVisual() {
        const carElements = gameBoard.querySelectorAll('.car');
        carElements.forEach((el, index) => {
            el.classList.remove('selected', 'active-move');
            if (index === selectedCarIndex) {
                if (isCarActive) {
                    el.classList.add('active-move');
                } else {
                    el.classList.add('selected');
                }
            }
        });
    }

    function startDrag(e) {
        e.preventDefault();
        
        const carEl = e.currentTarget;
        const carId = carEl.dataset.id;
        draggedCar = cars.find(c => c.id === carId);
        
        if (!draggedCar) return;
        
        selectedCarIndex = cars.findIndex(c => c.id === carId);
        isCarActive = false;
        updateSelectionVisual();
        
        isDragging = true;
        
        const pos = getEventPos(e);
        dragStartPos = pos;
        carStartPos = { x: draggedCar.x, y: draggedCar.y };
        
        carEl.style.zIndex = '10';
        
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchmove', onDrag, { passive: false });
        document.addEventListener('touchend', endDrag);
    }

    function getEventPos(e) {
        if (e.touches && e.touches.length > 0) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
        return { x: e.clientX, y: e.clientY };
    }

    function onDrag(e) {
        if (!isDragging || !draggedCar) return;
        e.preventDefault();
        
        const pos = getEventPos(e);
        const deltaX = pos.x - dragStartPos.x;
        const deltaY = pos.y - dragStartPos.y;
        
        const carEl = gameBoard.querySelector(`[data-id="${draggedCar.id}"]`);
        
        if (draggedCar.direction === 'horizontal') {
            const deltaCells = Math.round(deltaX / cellSize);
            let newX = carStartPos.x + deltaCells;
            newX = Math.max(0, Math.min(gridSize - draggedCar.length, newX));
            
            if (canMoveTo(draggedCar, newX, draggedCar.y)) {
                draggedCar.x = newX;
                updateCarPosition(carEl, draggedCar);
            }
        } else {
            const deltaCells = Math.round(deltaY / cellSize);
            let newY = carStartPos.y + deltaCells;
            newY = Math.max(0, Math.min(gridSize - draggedCar.length, newY));
            
            if (canMoveTo(draggedCar, draggedCar.x, newY)) {
                draggedCar.y = newY;
                updateCarPosition(carEl, draggedCar);
            }
        }
    }

    function canMoveTo(car, newX, newY) {
        if (newX < 0 || newY < 0) return false;
        if (car.direction === 'horizontal' && newX + car.length > gridSize) return false;
        if (car.direction === 'vertical' && newY + car.length > gridSize) return false;
        
        for (const otherCar of cars) {
            if (otherCar.id === car.id) continue;
            
            if (carsOverlap(car, newX, newY, otherCar)) {
                return false;
            }
        }
        
        return true;
    }

    function carsOverlap(car1, x1, y1, car2) {
        const car1Cells = getCarCells(car1, x1, y1);
        const car2Cells = getCarCells(car2, car2.x, car2.y);
        
        for (const cell1 of car1Cells) {
            for (const cell2 of car2Cells) {
                if (cell1.x === cell2.x && cell1.y === cell2.y) {
                    return true;
                }
            }
        }
        return false;
    }

    function getCarCells(car, x, y) {
        const cells = [];
        if (car.direction === 'horizontal') {
            for (let i = 0; i < car.length; i++) {
                cells.push({ x: x + i, y: y });
            }
        } else {
            for (let i = 0; i < car.length; i++) {
                cells.push({ x: x, y: y + i });
            }
        }
        return cells;
    }

    function endDrag(e) {
        if (!isDragging) return;
        
        isDragging = false;
        
        const carEl = gameBoard.querySelector(`[data-id="${draggedCar.id}"]`);
        if (carEl) {
            carEl.style.zIndex = '';
        }
        
        if (draggedCar.x !== carStartPos.x || draggedCar.y !== carStartPos.y) {
            moves++;
        }
        
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('mouseup', endDrag);
        document.removeEventListener('touchmove', onDrag);
        document.removeEventListener('touchend', endDrag);
        
        checkWin();
        
        draggedCar = null;
    }

    function checkWin() {
        const targetCar = cars.find(c => c.isTarget);
        if (!targetCar) return;
        
        if (targetCar.x + targetCar.length >= gridSize && targetCar.y === exitRow) {
            showWin();
        }
    }

    function showWin() {
        const targetCarEl = gameBoard.querySelector('.target-car');
        if (targetCarEl) {
            targetCarEl.classList.add('exiting');
        }
        
        setTimeout(() => {
            winMovesEl.textContent = moves;
            winModal.classList.add('show');
            
            const reward = Math.max(100, 300 - moves * 5);
            coins += reward;
            document.querySelector('.coins-reward').textContent = `+${reward}🪙`;
            
            const nextLevel = currentLevel + 1;
            if (nextLevel <= LEVELS.length && !unlockedLevels.includes(nextLevel)) {
                unlockedLevels.push(nextLevel);
            }
            
            updateUI();
            saveProgress();

            modalSelectedIndex = 1;
            updateModalSelection();
        }, 600);
    }

    function resetLevel() {
        winModal.classList.remove('show');
        clearModalSelection();
        loadLevel(currentLevel);
    }

    function nextLevel() {
        winModal.classList.remove('show');
        clearModalSelection();
        const next = currentLevel + 1;
        if (next <= LEVELS.length) {
            loadLevel(next);
        } else {
            alert('🎉 恭喜你通关所有关卡！');
            loadLevel(1);
        }
    }

    function clearModalSelection() {
        const buttons = winModal.querySelectorAll('.modal-btn');
        buttons.forEach(btn => btn.classList.remove('modal-selected'));
    }

    function showHint() {
        if (hints <= 0) {
            if (coins >= 200) {
                coins -= 200;
                hints++;
                updateUI();
                saveProgress();
            } else {
                alert('金币不足，无法使用提示！');
                return;
            }
        }
        
        hints--;
        updateUI();
        saveProgress();
        
        const move = findBestMove();
        if (move) {
            const carEl = gameBoard.querySelector(`[data-id="${move.carId}"]`);
            if (carEl) {
                carEl.classList.add('celebrate');
                setTimeout(() => {
                    carEl.classList.remove('celebrate');
                }, 1500);
            }
        }
    }

    function findBestMove() {
        const targetCar = cars.find(c => c.isTarget);
        if (!targetCar) return null;
        
        for (const car of cars) {
            if (car.direction === 'horizontal') {
                for (let dx = 1; dx <= gridSize; dx++) {
                    if (canMoveTo(car, car.x + dx, car.y)) {
                        const origX = car.x;
                        car.x = car.x + dx;
                        if (canTargetExit(targetCar)) {
                            car.x = origX;
                            return { carId: car.id, dx, dy: 0 };
                        }
                        car.x = origX;
                    } else {
                        break;
                    }
                }
                for (let dx = -1; dx >= -gridSize; dx--) {
                    if (canMoveTo(car, car.x + dx, car.y)) {
                        const origX = car.x;
                        car.x = car.x + dx;
                        if (canTargetExit(targetCar)) {
                            car.x = origX;
                            return { carId: car.id, dx, dy: 0 };
                        }
                        car.x = origX;
                    } else {
                        break;
                    }
                }
            } else {
                for (let dy = 1; dy <= gridSize; dy++) {
                    if (canMoveTo(car, car.x, car.y + dy)) {
                        const origY = car.y;
                        car.y = car.y + dy;
                        if (canTargetExit(targetCar)) {
                            car.y = origY;
                            return { carId: car.id, dx: 0, dy };
                        }
                        car.y = origY;
                    } else {
                        break;
                    }
                }
                for (let dy = -1; dy >= -gridSize; dy--) {
                    if (canMoveTo(car, car.x, car.y + dy)) {
                        const origY = car.y;
                        car.y = car.y + dy;
                        if (canTargetExit(targetCar)) {
                            car.y = origY;
                            return { carId: car.id, dx: 0, dy };
                        }
                        car.y = origY;
                    } else {
                        break;
                    }
                }
            }
        }
        
        const movableCars = cars.filter(c => {
            if (c.direction === 'horizontal') {
                return canMoveTo(c, c.x + 1, c.y) || canMoveTo(c, c.x - 1, c.y);
            } else {
                return canMoveTo(c, c.x, c.y + 1) || canMoveTo(c, c.x, c.y - 1);
            }
        });
        
        if (movableCars.length > 0) {
            return { carId: movableCars[0].id, dx: 0, dy: 0 };
        }
        
        return null;
    }

    function canTargetExit(targetCar) {
        if (targetCar.y !== exitRow) return false;
        
        for (let x = targetCar.x + targetCar.length; x < gridSize; x++) {
            for (const otherCar of cars) {
                if (otherCar.id === targetCar.id) continue;
                const cells = getCarCells(otherCar, otherCar.x, otherCar.y);
                if (cells.some(c => c.x === x && c.y === exitRow)) {
                    return false;
                }
            }
        }
        return true;
    }

    function showLevelSelect() {
        renderLevelGrid();
        levelModal.classList.add('show');
    }

    function renderLevelGrid() {
        levelGrid.innerHTML = '';
        
        LEVELS.forEach(level => {
            const item = document.createElement('div');
            const isUnlocked = unlockedLevels.includes(level.id);
            const isCurrent = level.id === currentLevel;
            
            item.className = `level-item ${isUnlocked ? 'unlocked' : 'locked'} ${isCurrent ? 'current' : ''}`;
            item.textContent = isUnlocked ? level.id : '🔒';
            
            if (isUnlocked) {
                item.addEventListener('click', () => {
                    levelModal.classList.remove('show');
                    loadLevel(level.id);
                });
            }
            
            levelGrid.appendChild(item);
        });
    }

    function setupGamepadListeners() {
        window.addEventListener('gamepadconnected', (e) => {
            console.log('游戏手柄已连接:', e.gamepad.id);
            gamepadConnected = true;
            gamepadHint.classList.add('connected');
            gamepadHint.textContent = `🎮 ${e.gamepad.id.substring(0, 20)}...`;
        });

        window.addEventListener('gamepaddisconnected', (e) => {
            console.log('游戏手柄已断开:', e.gamepad.id);
            gamepadConnected = false;
            gamepadHint.classList.remove('connected');
        });

        const gamepads = navigator.getGamepads();
        for (let i = 0; i < gamepads.length; i++) {
            if (gamepads[i]) {
                gamepadConnected = true;
                gamepadHint.classList.add('connected');
                gamepadHint.textContent = `🎮 ${gamepads[i].id.substring(0, 20)}...`;
                break;
            }
        }
    }

    function gameLoop() {
        pollGamepad();
        if (moveCooldown > 0) {
            moveCooldown -= 16;
        }
        requestAnimationFrame(gameLoop);
    }

    function pollGamepad() {
        const gamepads = navigator.getGamepads();
        const gamepad = gamepads[0];
        
        if (!gamepad) return;

        const stickX = gamepad.axes[0] || 0;
        const stickY = gamepad.axes[1] || 0;
        const absX = Math.abs(stickX);
        const absY = Math.abs(stickY);
        let stickUp = false, stickDown = false, stickLeft = false, stickRight = false;

        if (absX > STICK_DEADZONE || absY > STICK_DEADZONE) {
            if (absX > absY) {
                stickLeft = stickX < -STICK_DEADZONE;
                stickRight = stickX > STICK_DEADZONE;
            } else {
                stickUp = stickY < -STICK_DEADZONE;
                stickDown = stickY > STICK_DEADZONE;
            }
        }

        const dpadUp = gamepad.buttons[12].pressed || stickUp;
        const dpadDown = gamepad.buttons[13].pressed || stickDown;
        const dpadLeft = gamepad.buttons[14].pressed || stickLeft;
        const dpadRight = gamepad.buttons[15].pressed || stickRight;

        const aButton = gamepad.buttons[0].pressed;
        const bButton = gamepad.buttons[1].pressed;

        if (winModal.classList.contains('show')) {
            if (dpadLeft && !lastDpadStates.left) {
                modalSelectedIndex = 0;
                updateModalSelection();
            } else if (dpadRight && !lastDpadStates.right) {
                modalSelectedIndex = 1;
                updateModalSelection();
            }

            if (aButton && !lastButtonStates.a) {
                confirmModalSelection();
            }

            if (bButton && !lastButtonStates.b) {
                modalSelectedIndex = 0;
                confirmModalSelection();
            }

            lastDpadStates = { up: dpadUp, down: dpadDown, left: dpadLeft, right: dpadRight };
            lastButtonStates.a = aButton;
            lastButtonStates.b = bButton;
            return;
        }

        if (!isCarActive) {
            if (dpadUp && !lastDpadStates.up) {
                selectCarByDirection('up');
            } else if (dpadDown && !lastDpadStates.down) {
                selectCarByDirection('down');
            } else if (dpadLeft && !lastDpadStates.left) {
                selectCarByDirection('left');
            } else if (dpadRight && !lastDpadStates.right) {
                selectCarByDirection('right');
            }
        } else {
            if (moveCooldown <= 0) {
                const car = cars[selectedCarIndex];
                let moved = false;

                if (car.direction === 'horizontal') {
                    if (dpadLeft) {
                        moved = moveCarByStep(selectedCarIndex, -1, 0);
                    } else if (dpadRight) {
                        moved = moveCarByStep(selectedCarIndex, 1, 0);
                    }
                } else {
                    if (dpadUp) {
                        moved = moveCarByStep(selectedCarIndex, 0, -1);
                    } else if (dpadDown) {
                        moved = moveCarByStep(selectedCarIndex, 0, 1);
                    }
                }

                if (moved) {
                    moveCooldown = MOVE_COOLDOWN_MS;
                }
            }
        }

        if (aButton && !lastButtonStates.a) {
            toggleCarActive();
        }

        if (bButton && !lastButtonStates.b) {
            if (isCarActive) {
                isCarActive = false;
                updateSelectionVisual();
            }
        }

        lastDpadStates = { up: dpadUp, down: dpadDown, left: dpadLeft, right: dpadRight };
        lastButtonStates.a = aButton;
        lastButtonStates.b = bButton;
    }

    function updateModalSelection() {
        const buttons = winModal.querySelectorAll('.modal-btn');
        buttons.forEach((btn, index) => {
            btn.classList.toggle('modal-selected', index === modalSelectedIndex);
        });
    }

    function confirmModalSelection() {
        const btnId = MODAL_BUTTONS[modalSelectedIndex];
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.click();
        }
    }

    function selectCarByDirection(direction) {
        if (cars.length === 0) return;

        const currentCar = cars[selectedCarIndex];
        const currentCenter = {
            x: currentCar.x + (currentCar.direction === 'horizontal' ? currentCar.length / 2 : 0.5),
            y: currentCar.y + (currentCar.direction === 'vertical' ? currentCar.length / 2 : 0.5)
        };

        let bestIndex = -1;
        let bestDistance = Infinity;

        for (let i = 0; i < cars.length; i++) {
            if (i === selectedCarIndex) continue;

            const car = cars[i];
            const carCenter = {
                x: car.x + (car.direction === 'horizontal' ? car.length / 2 : 0.5),
                y: car.y + (car.direction === 'vertical' ? car.length / 2 : 0.5)
            };

            const dx = carCenter.x - currentCenter.x;
            const dy = carCenter.y - currentCenter.y;

            let inDirection = false;
            let distance = 0;

            switch (direction) {
                case 'up':
                    inDirection = dy < -0.5;
                    distance = Math.abs(dy) + Math.abs(dx) * 0.5;
                    break;
                case 'down':
                    inDirection = dy > 0.5;
                    distance = Math.abs(dy) + Math.abs(dx) * 0.5;
                    break;
                case 'left':
                    inDirection = dx < -0.5;
                    distance = Math.abs(dx) + Math.abs(dy) * 0.5;
                    break;
                case 'right':
                    inDirection = dx > 0.5;
                    distance = Math.abs(dx) + Math.abs(dy) * 0.5;
                    break;
            }

            if (inDirection && distance < bestDistance) {
                bestDistance = distance;
                bestIndex = i;
            }
        }

        if (bestIndex === -1) {
            selectedCarIndex = (selectedCarIndex + 1) % cars.length;
        } else {
            selectedCarIndex = bestIndex;
        }

        updateSelectionVisual();
    }

    function toggleCarActive() {
        isCarActive = !isCarActive;
        updateSelectionVisual();
    }

    function moveCarByStep(carIndex, dx, dy) {
        const car = cars[carIndex];
        if (!car) return false;

        const newX = car.x + dx;
        const newY = car.y + dy;

        if (canMoveTo(car, newX, newY)) {
            car.x = newX;
            car.y = newY;
            
            const carEl = gameBoard.querySelectorAll('.car')[carIndex];
            if (carEl) {
                updateCarPosition(carEl, car);
            }
            
            moves++;
            checkWin();
            return true;
        }
        
        return false;
    }

    function setupEventListeners() {
        document.getElementById('resetBtn').addEventListener('click', resetLevel);
        document.getElementById('hintBtn').addEventListener('click', showHint);
        document.getElementById('nextLevelBtn').addEventListener('click', nextLevel);
        document.getElementById('replayBtn').addEventListener('click', () => {
            winModal.classList.remove('show');
            clearModalSelection();
            loadLevel(currentLevel);
        });
        document.getElementById('levelSelectBtn').addEventListener('click', showLevelSelect);
        document.getElementById('closeLevelModal').addEventListener('click', () => {
            levelModal.classList.remove('show');
        });
        
        levelModal.addEventListener('click', (e) => {
            if (e.target === levelModal) {
                levelModal.classList.remove('show');
            }
        });
        
        window.addEventListener('resize', () => {
            calculateCellSize();
            renderBoard();
            updateSelectionVisual();
        });

        document.addEventListener('keydown', (e) => {
            if (winModal.classList.contains('show')) {
                if (e.key === 'ArrowLeft') {
                    modalSelectedIndex = 0;
                    updateModalSelection();
                } else if (e.key === 'ArrowRight') {
                    modalSelectedIndex = 1;
                    updateModalSelection();
                } else if (e.key === 'Enter' || e.key === ' ') {
                    confirmModalSelection();
                } else if (e.key === 'Escape' || e.key === 'Backspace') {
                    modalSelectedIndex = 0;
                    confirmModalSelection();
                }
                return;
            }

            if (!isCarActive) {
                switch (e.key) {
                    case 'ArrowUp':
                        selectCarByDirection('up');
                        break;
                    case 'ArrowDown':
                        selectCarByDirection('down');
                        break;
                    case 'ArrowLeft':
                        selectCarByDirection('left');
                        break;
                    case 'ArrowRight':
                        selectCarByDirection('right');
                        break;
                    case 'Enter':
                    case ' ':
                        toggleCarActive();
                        break;
                }
            } else {
                const car = cars[selectedCarIndex];
                let moved = false;

                if (car.direction === 'horizontal') {
                    if (e.key === 'ArrowLeft') {
                        moved = moveCarByStep(selectedCarIndex, -1, 0);
                    } else if (e.key === 'ArrowRight') {
                        moved = moveCarByStep(selectedCarIndex, 1, 0);
                    }
                } else {
                    if (e.key === 'ArrowUp') {
                        moved = moveCarByStep(selectedCarIndex, 0, -1);
                    } else if (e.key === 'ArrowDown') {
                        moved = moveCarByStep(selectedCarIndex, 0, 1);
                    }
                }

                if (e.key === 'Escape' || e.key === 'Backspace') {
                    isCarActive = false;
                    updateSelectionVisual();
                }
            }

            if (e.key === 'r' || e.key === 'R') {
                resetLevel();
            }
        });
    }

    return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
    Game.init();
});
