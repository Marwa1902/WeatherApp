const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');
const dinoCanvas = document.getElementById('dino-game'); 

search.addEventListener('click', () => {

    const APIKey = 'api key';
    const city = document.querySelector('.search-box input').value;

    if (city === '')
        return;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
        .then(response => response.json())
        .then(json => {

            if (json.cod === '404') {
                container.style.height = '600px';
                weatherBox.style.display = 'none';
                weatherDetails.style.display = 'none';
                error404.style.display = 'block';
                error404.classList.add('fadeIn');

                dinoCanvas.style.display = 'block';

                startDinoGame(); 
                
                return;
            }

            error404.style.display = 'none';
            error404.classList.remove('fadeIn');
            dinoCanvas.style.display = 'none'; 
            weatherBox.style.display = '';
            weatherDetails.style.display = '';
            weatherBox.classList.add('fadeIn');
            weatherDetails.classList.add('fadeIn');
            container.style.height = '590px';

            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const humidity = document.querySelector('.weather-details .humidity span');
            const wind = document.querySelector('.weather-details .wind span');

            switch (json.weather[0].main) {
                case 'Clear':
                    image.src = 'images/clear.png';
                    break;

                case 'Rain':
                    image.src = 'images/rain.png';
                    break;

                case 'Snow':
                    image.src = 'images/snow.png';
                    break;

                case 'Clouds':
                    image.src = 'images/cloud.png';
                    break;

                case 'Haze':
                    image.src = 'images/mist.png';
                    break;

                default:
                    image.src = '';
            }

            temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
            description.innerHTML = `${json.weather[0].description}`;
            humidity.innerHTML = `${json.main.humidity}%`;
            wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;

            weatherBox.style.display = '';
            weatherDetails.style.display = '';
            weatherBox.classList.add('fadeIn');
            weatherDetails.classList.add('fadeIn');
            container.style.height = '590px';

        });

});

function startDinoGame() {
    const canvas = document.getElementById('dino-game');
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 150;

    let dino = { x: 10, y: 120, width: 20, height: 20, dy: 0, gravity: 0.5 };
    let obstacles = [];
    let gameSpeed = 2;
    let isJumping = false;

    function drawDino() {
        ctx.fillStyle = '#333';
        ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
    }

    function drawObstacles() {
        ctx.fillStyle = '#555';
        obstacles.forEach(obstacle => {
            obstacle.x -= gameSpeed;
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });
    }

    function jump() {
        if (!isJumping) {
            dino.dy = -8;
            isJumping = true;
        }
    }

    function update() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update dino position
        dino.dy += dino.gravity;
        dino.y += dino.dy;

        // Prevent dino from falling below ground
        if (dino.y > 120) {
            dino.y = 120;
            dino.dy = 0;
            isJumping = false;
        }

        // Add new obstacles periodically
        if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < 250) {
            obstacles.push({ x: 400, y: 130, width: 20, height: 20 });
        }

        // Remove off-screen obstacles
        obstacles = obstacles.filter(obstacle => obstacle.x > -20);

        drawDino();
        drawObstacles();

        requestAnimationFrame(update);
    }

    // Start game on space key press
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space') jump();
    });

    update();
}