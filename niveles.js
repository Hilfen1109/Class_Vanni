// Sistema dinámico de niveles - Estilo Duolingo
let exerciseEngine = null;

// Inicializar nivel dinámico
function initializeLevel(levelNumber) {
    const config = getLevelConfig(levelNumber);
    if (!config) {
        console.error(`Configuración no encontrada para el nivel ${levelNumber}`);
        return;
    }

    // Verificar si el nivel está desbloqueado
    if (!isLevelUnlocked(levelNumber)) {
        alert('Este nivel no está desbloqueado aún. Completa los niveles anteriores.');
        window.location.href = 'inicio.html';
        return;
    }

    // Verificar corazones
    const currentHearts = parseInt(localStorage.getItem('hearts')) || 5;
    if (currentHearts < config.heartsRequired) {
        alert(`Necesitas al menos ${config.heartsRequired} corazones para este nivel.`);
        window.location.href = 'inicio.html';
        return;
    }

    // Crear motor de ejercicios
    exerciseEngine = new ExerciseEngine(levelNumber);

    // Actualizar título de la página
    document.title = `${config.title} - Class Vanni`;

    // Actualizar header con información del nivel
    updateLevelHeader(config);

    // Asegurar que el contenedor esté visible
    const quizContainer = document.getElementById('seccion-quiz');
    if (quizContainer) {
        quizContainer.style.display = 'block';
    }

    // Iniciar primer ejercicio
    setTimeout(() => {
        if (exerciseEngine) {
            exerciseEngine.renderCurrentExercise();
        }
    }, 1000);
}

// Actualizar header con información del nivel
function updateLevelHeader(config) {
    const levelTitle = document.querySelector('.lesson-title');
    const levelSubtitle = document.querySelector('.lesson-subtitle');

    if (levelTitle) levelTitle.textContent = config.title;
    if (levelSubtitle) levelSubtitle.textContent = config.subtitle;

    // Actualizar color del nivel
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        progressFill.style.background = `linear-gradient(90deg, ${config.color}, ${adjustColor(config.color, 20)})`;
    }

    // Agregar elementos visuales
    addVisualElements(config);
}

function addVisualElements(config) {
    // Limpiar elementos visuales anteriores
    clearVisualElements();

    // Solo agregar elementos visuales sutiles
    addFloatingCharacter(config.character);
    addThematicBackground(config.background);
}

function clearVisualElements() {
    // Remover elementos visuales anteriores
    const existingElements = document.querySelectorAll('.level-character, .particle-container, .decorative-elements');
    existingElements.forEach(element => element.remove());
}

function addFloatingCharacter(character) {
    // Remover personaje anterior si existe
    const existingCharacter = document.querySelector('.level-character');
    if (existingCharacter) {
        existingCharacter.remove();
    }

    const characterElement = document.createElement('div');
    characterElement.className = 'level-character floating-element';
    characterElement.textContent = character;
    characterElement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        font-size: 40px;
        z-index: 1000;
        animation: float 3s ease-in-out infinite;
    `;

    document.body.appendChild(characterElement);
}

function addThematicBackground(background) {
    const body = document.body;
    body.style.background = background;

    // Agregar partículas flotantes
    addFloatingParticles();
}

function addFloatingParticles() {
    // Partículas muy sutiles para no interferir
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    `;

    // Crear solo 3 partículas muy sutiles
    for (let i = 0; i < 3; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            animation: particleFloat ${8 + Math.random() * 4}s linear infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 5}s;
        `;
        particleContainer.appendChild(particle);
    }

    document.body.appendChild(particleContainer);
}
// Funciones decorativas eliminadas - ahora se usa addDecorativeElements simplificado

// Ajustar color (hacer más claro)
function adjustColor(color, amount) {
    const hex = color.replace('#', '');
    const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + amount);
    const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + amount);
    const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + amount);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Function to complete a lesson (called from lesson pages)
function completeLesson(lessonNumber) {
    if (window.duolingoApp) {
        window.duolingoApp.completeLesson(lessonNumber);
    }

    // Legacy support - solo marcar como completado si realmente se aprobó
    const key = `nivel${lessonNumber}_completado`;
    localStorage.setItem(key, 'true');

    // También agregar a la lista de lecciones completadas
    const completedLessons = JSON.parse(localStorage.getItem('completedLessons')) || [];
    if (!completedLessons.includes(lessonNumber)) {
        completedLessons.push(lessonNumber);
        localStorage.setItem('completedLessons', JSON.stringify(completedLessons));
    }
}

// Function to add XP (called from lesson pages)
function addXP(amount) {
    if (window.duolingoApp) {
        window.duolingoApp.addXP(amount);
    }
}

// Function to lose a heart (called from lesson pages)
function loseHeart() {
    if (window.duolingoApp) {
        window.duolingoApp.loseHeart();
    }
}
// Configuración de niveles
function configurarNivelInicial(level) {
    const verQuizBtn = document.getElementById('verQuizBtn');
    if (verQuizBtn) {
        verQuizBtn.addEventListener('click', () => {
            document.getElementById('seccion-video').style.display = 'none';
            document.getElementById('seccion-quiz').style.display = 'block';
            initializeLevel(level);
        });
    }
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    // NO inicializar automáticamente - solo cuando se haga clic en "Continuar"
    // Esto evita que aparezcan preguntas debajo del video
});