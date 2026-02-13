// 賓果遊戲系統 JavaScript 邏輯

class BingoGame {
    constructor() {
        // 遊戲配置
        this.minNumber = 1;
        this.maxNumber = 90;
        this.ballCount = 1;
        this.totalBalls = this.maxNumber - this.minNumber + 1;

        // 遊戲狀態
        this.allBalls = [];
        this.drawnBalls = [];
        this.isDrawing = false;

        // DOM 元素
        this.ballsContainer = document.getElementById('ballsContainer');
        this.drawButton = document.getElementById('drawButton');
        this.applySettingsBtn = document.getElementById('applySettings');
        this.resetGameBtn = document.getElementById('resetGame');
        this.minNumberInput = document.getElementById('minNumber');
        this.maxNumberInput = document.getElementById('maxNumber');
        this.ballCountInput = document.getElementById('ballCount');
        this.drawnCountSpan = document.getElementById('drawnCount');
        this.totalBallsSpan = document.getElementById('totalBalls');
        this.configCountSpan = document.getElementById('configCount');
        this.drawnBallsDisplay = document.getElementById('drawnBallsDisplay');
        this.drawnList = document.getElementById('drawnList');
        this.fireworksContainer = document.getElementById('fireworksContainer');

        this.init();
    }

    init() {
        this.applySettings();
        this.attachEventListeners();
    }

    attachEventListeners() {
        this.drawButton.addEventListener('click', () => this.drawBalls());
        this.applySettingsBtn.addEventListener('click', () => this.applySettings());
        this.resetGameBtn.addEventListener('click', () => this.resetGame());
    }

    applySettings() {
        this.minNumber = parseInt(this.minNumberInput.value) || 1;
        this.maxNumber = parseInt(this.maxNumberInput.value) || 90;
        this.ballCount = parseInt(this.ballCountInput.value) || 1;

        this.totalBalls = this.maxNumber - this.minNumber + 1;

        // 驗證 ballCount
        if (this.ballCount > this.totalBalls) {
            this.ballCount = this.totalBalls;
            this.ballCountInput.value = this.ballCount;
        }

        this.resetGame();
        this.configCountSpan.textContent = this.totalBalls;
    }

    resetGame() {
        this.drawnBalls = [];
        this.isDrawing = false;
        this.allBalls = this.generateBalls();
        this.renderBalls();
        this.updateStats();
        this.drawnBallsDisplay.innerHTML = '';
        this.drawnList.innerHTML = '';
        this.drawButton.disabled = false;
    }

    generateBalls() {
        const balls = [];
        for (let i = this.minNumber; i <= this.maxNumber; i++) {
            balls.push(i);
        }
        return this.shuffleArray(balls);
    }

    shuffleArray(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    renderBalls() {
        this.ballsContainer.innerHTML = '';

        const centerX = 175; // 容器中心 X
        const centerY = 175; // 容器中心 Y

        this.allBalls.forEach((number, index) => {
            const ballElement = document.createElement('div');
            ballElement.className = 'ball';
            ballElement.textContent = number;

            // 在容器內隨機分散放置球的初始位置
            const x = Math.random() * 280 + 10; // 距離邊界至少 10px
            const y = Math.random() * 280 + 10;

            ballElement.style.left = x + 'px';
            ballElement.style.top = y + 'px';

            // 為每個球設置隨機的動畫位移，產生滾動效果
            const angle1 = Math.random() * Math.PI * 2;
            const angle2 = Math.random() * Math.PI * 2;
            const angle3 = Math.random() * Math.PI * 2;
            const dist = 40 + Math.random() * 60; // 每個球移動 40-100px

            ballElement.style.setProperty('--tx1', Math.cos(angle1) * dist + 'px');
            ballElement.style.setProperty('--ty1', Math.sin(angle1) * dist + 'px');
            ballElement.style.setProperty('--tx2', Math.cos(angle2) * dist + 'px');
            ballElement.style.setProperty('--ty2', Math.sin(angle2) * dist + 'px');
            ballElement.style.setProperty('--tx3', Math.cos(angle3) * dist + 'px');
            ballElement.style.setProperty('--ty3', Math.sin(angle3) * dist + 'px');

            // 隨機動畫延遲，讓球不同步運動
            const delay = (index * 0.05) % 4;
            ballElement.style.animationDelay = delay + 's';

            this.ballsContainer.appendChild(ballElement);
        });
    }

    drawBalls() {
        if (this.isDrawing) return;

        const remainingBalls = this.allBalls.filter(ball => !this.drawnBalls.includes(ball));
        if (remainingBalls.length === 0) {
            alert('所有球都已抽出！');
            return;
        }

        // 根據 ballCount 設置決定要抽幾顆球
        const drawCount = Math.min(this.ballCount, remainingBalls.length);
        const drawnThisRound = [];

        this.isDrawing = true;
        this.drawButton.disabled = true;

        // 清空本次抽取顯示
        this.drawnBallsDisplay.innerHTML = '';

        // 動畫延遲，讓球籠滾動中呈現抽取過程
        setTimeout(() => {
            // 根據 drawCount 來循環抽取正確數量的球
            for (let i = 0; i < drawCount; i++) {
                const randomIndex = Math.floor(Math.random() * remainingBalls.length);
                const ball = remainingBalls.splice(randomIndex, 1)[0];
                drawnThisRound.push(ball);
                this.drawnBalls.push(ball);

                // 延遲顯示每顆球，製造逐個抽取的效果
                setTimeout(() => {
                    this.displayDrawnBall(ball);
                    this.addToDrawnList(ball);
                    this.createFireworks(ball);
                }, i * 300);
            }

            // 抽取完成後重新渲染球籠，移除已抽的球
            setTimeout(() => {
                this.renderBalls();
                this.updateStats();
                this.isDrawing = false;

                if (remainingBalls.length === 0) {
                    this.drawButton.disabled = true;
                } else {
                    this.drawButton.disabled = false;
                }
            }, drawCount * 300 + 200);
        }, 300);
    }

    displayDrawnBall(number) {
        const ballItem = document.createElement('div');
        ballItem.className = 'drawn-ball-item';
        ballItem.textContent = number;
        this.drawnBallsDisplay.appendChild(ballItem);
    }

    addToDrawnList(number) {
        const listItem = document.createElement('div');
        listItem.className = 'drawn-list-item';
        listItem.textContent = number;
        this.drawnList.appendChild(listItem);
    }

    createFireworks(ballNumber) {
        // 在隨機位置創建花火
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * (window.innerHeight * 0.7); // 限制在上半部

        const firework = document.createElement('div');
        firework.className = 'firework';
        firework.style.left = x + 'px';
        firework.style.top = y + 'px';

        // 創建花火粒子
        const particleCount = 30;
        const colors = ['#ff6b6b', '#4ecdc4', '#ffd93d', '#ff8787', '#44b3aa'];

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'firework-particle';
            
            const angle = (i / particleCount) * Math.PI * 2;
            const velocity = 4 + Math.random() * 6;
            const tx = Math.cos(angle) * velocity * 50;
            const ty = Math.sin(angle) * velocity * 50;

            particle.style.setProperty('--tx', tx + 'px');
            particle.style.setProperty('--ty', ty + 'px');
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.left = '0px';
            particle.style.top = '0px';

            firework.appendChild(particle);
        }

        this.fireworksContainer.appendChild(firework);

        // 移除花火元素
        setTimeout(() => {
            firework.remove();
        }, 1200);
    }

    updateStats() {
        this.drawnCountSpan.textContent = this.drawnBalls.length;
        this.totalBallsSpan.textContent = this.totalBalls;
    }
}

// 初始化遊戲
document.addEventListener('DOMContentLoaded', () => {
    window.bingoGame = new BingoGame();
});
