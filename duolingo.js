// Duolingo-style functionality for Class Vanni
class DuolingoApp {
    constructor() {
        // Verificar si el usuario está registrado
        if (!this.isUserRegistered()) {
            window.location.href = 'login.html';
            return;
        }

        // Cargar datos del usuario
        this.loadUserData();
        this.init();
    }

    isUserRegistered() {
        return localStorage.getItem('userRegistered') === 'true';
    }

    loadUserData() {
        const userData = JSON.parse(localStorage.getItem('userData')) || {};

        this.userId = userData.id || localStorage.getItem('userId');
        this.userName = userData.name || localStorage.getItem('userName');
        this.userEmail = userData.email || localStorage.getItem('userEmail');
        // Coerción a número para evitar concatenaciones y errores de tipo
        this.streak = Number(userData.streak ?? localStorage.getItem('streak')) || 0;
        this.xp = Number(userData.xp ?? localStorage.getItem('xp')) || 0;
        this.hearts = Number(userData.hearts ?? localStorage.getItem('hearts')) || 5;
        this.maxHearts = 5;
        this.dailyGoal = 20;
        this.currentProgress = Number(userData.dailyProgress ?? localStorage.getItem('dailyProgress')) || 0;
        this.lastActivityDate = userData.lastActivity || null;
        this.level = Number(userData.level ?? localStorage.getItem('level')) || 1;
        // Merge completed lessons from multiple possible storage locations (legacy-safe)
        const completedFromUser = userData.completedLessons || [];
        const completedFromKey = JSON.parse(localStorage.getItem('completedLessons') || '[]');
        const legacyFlags = [];
        for (let i = 1; i <= 10; i++) {
            if (localStorage.getItem(`nivel${i}_completado`) === 'true') legacyFlags.push(i);
        }
        this.completedLessons = Array.from(new Set([...
            completedFromUser, ...completedFromKey, ...legacyFlags
        ])).sort((a, b) => a - b);
        this.achievements = userData.achievements || [];
    }

    saveUserData() {
        const userData = {
            id: this.userId,
            name: this.userName,
            email: this.userEmail,
            xp: this.xp,
            streak: this.streak,
            hearts: this.hearts,
            level: this.level,
            dailyProgress: this.currentProgress,
            lastActivity: new Date().toISOString(),
            completedLessons: this.completedLessons,
            achievements: this.achievements
        };

        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('completedLessons', JSON.stringify(this.completedLessons));

        // Feedback motivacional instantáneo
        if (typeof window.showMotivation === 'function') {
            window.showMotivation(this.xp, this.streak);
        }
    }

    init() {
    this.checkStreak();
    this.updateStats();
    this.setupLessonCards();
    this.setupPracticeCards();
    this.checkDailyGoal();
    this.loadUserProgress();
    }

    // Función de debug para verificar el estado del sistema de niveles

    checkStreak() {
        const today = new Date().toDateString();
        const lastActivity = this.lastActivityDate;

        if (!lastActivity) {
            // Primera vez que usa la app
            this.lastActivityDate = today;
            this.saveUserData();
            return;
        }

        const lastActivityDate = new Date(lastActivity);
        const todayDate = new Date(today);
        const daysDifference = Math.floor((todayDate - lastActivityDate) / (1000 * 60 * 60 * 24));

        if (daysDifference === 0) {
            // Mismo día, mantener racha actual
            return;
        } else if (daysDifference === 1) {
            // Día siguiente consecutivo, mantener racha
            this.streak++;
            this.lastActivityDate = today;
            // Reiniciar progreso diario al comenzar un nuevo día
            this.currentProgress = 0;
            this.saveUserData();
            this.showStreakMaintainedNotification();
        } else if (daysDifference > 1) {
            // Perdió la racha - más de un día sin actividad
            this.streak = 0;
            this.lastActivityDate = today;
            // Reiniciar progreso diario al retomar después de varios días
            this.currentProgress = 0;
            this.saveUserData();

            // Mostrar notificación de racha perdida
            this.showStreakLostNotification(daysDifference);
        }
    }

    showStreakMaintainedNotification() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #3B82F6;
            color: white;
            padding: 20px 30px;
            border-radius: 15px;
            text-align: center;
            z-index: 10000;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        `;

        notification.innerHTML = `
            <div style="font-size: 40px; margin-bottom: 10px;">🔥</div>
            <h3 style="margin-bottom: 10px;">¡Racha mantenida!</h3>
            <p>Día ${this.streak} consecutivo</p>
            <p style="font-size: 14px; opacity: 0.9;">¡Sigue así!</p>
        `;

        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    showStreakLostNotification(daysLost) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #ff6b6b;
            color: white;
            padding: 20px 30px;
            border-radius: 15px;
            text-align: center;
            z-index: 10000;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        `;

        notification.innerHTML = `
            <div style="font-size: 40px; margin-bottom: 10px;">💔</div>
            <h3 style="margin-bottom: 10px;">¡Racha perdida!</h3>
            <p>No has practicado por ${daysLost} días.</p>
            <p style="font-size: 14px; opacity: 0.9;">¡Vuelve a empezar y mantén tu racha!</p>
        `;

        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 4000);
    }

    updateStats() {
        document.getElementById('streak').textContent = this.streak;
        document.getElementById('xp').textContent = this.xp;
        document.getElementById('hearts').textContent = this.hearts;

        // Update daily goal progress
        const goalFill = document.querySelector('.goal-fill');
        if (goalFill) {
            const progressPercentage = (this.currentProgress / this.dailyGoal) * 100;
            goalFill.style.width = `${Math.min(progressPercentage, 100)}%`;
        }
    }

    // Función para cerrar sesión
    logout() {
        // Limpiar datos del usuario actual
        localStorage.clear()

        // Redirigir al login
        window.location.href = 'login.html';
    }

    // Función para cambiar de usuario
    switchUser() {
        const modal = this.createModal('Cambiar Usuario', `
            <div class="switch-user-container">
                <h3>¿Qué quieres hacer?</h3>
                <div class="switch-options">
                    <button class="action-button" onclick="duolingoApp.logout()">
                        <i class="fas fa-sign-out-alt"></i>
                        Cerrar Sesión
                    </button>
                    <button class="action-button" onclick="duolingoApp.registerNewUser()">
                        <i class="fas fa-user-plus"></i>
                        Registrar Nuevo Usuario
                    </button>
                </div>
                <div class="current-user-info">
                    <h4>Usuario Actual</h4>
                    <p><strong>Nombre:</strong> ${this.userName}</p>
                    <p><strong>Email:</strong> ${this.userEmail}</p>
                    <p><strong>XP:</strong> ${this.xp}</p>
                    <p><strong>Nivel:</strong> ${this.level}</p>
                </div>
            </div>
        `);
        document.body.appendChild(modal);
    }

    // Función para registrar nuevo usuario
    registerNewUser() {
        // Cerrar modal actual
        document.querySelector('.modal').remove();

        // Redirigir al login para registrar nuevo usuario
        window.location.href = 'login.html';
    }

    setupLessonCards() {
        const lessonCards = document.querySelectorAll('.lesson-card');
        lessonCards.forEach((card, index) => {
            const lessonNumber = index + 1;
            const isLocked = card.classList.contains('locked');

            if (!isLocked) {
                card.addEventListener('click', () => {
                    this.startLesson(lessonNumber);
                });
            }
        });
    }

    setupPracticeCards() {
        const practiceCards = document.querySelectorAll('.practice-card');
        practiceCards.forEach((card, index) => {
            card.addEventListener('click', () => {
                // Siempre iniciar práctica según el índice disponible (Ranking eliminado)
                this.startPractice(index);
            });
        });
    }
    getRanking() {
        // Obtener ranking desde localStorage
        const ranking = JSON.parse(localStorage.getItem('userRanking')) || [];

        // Actualizar datos del usuario actual
        const userIndex = ranking.findIndex(user => user.id === this.userId);
        if (userIndex !== -1) {
            ranking[userIndex].xp = this.xp;
            ranking[userIndex].streak = this.streak;
            ranking[userIndex].level = this.level;
            ranking[userIndex].lastActivity = new Date().toISOString();
        } else {
            ranking.push({
                id: this.userId,
                name: this.userName,
                email: this.userEmail,
                xp: this.xp,
                streak: this.streak,
                level: this.level,
                lastActivity: new Date().toISOString()
            });
        }

        // Ordenar por XP (descendente), luego por streak, luego por nivel
        ranking.sort((a, b) => {
            if (b.xp !== a.xp) return b.xp - a.xp;
            if (b.streak !== a.streak) return b.streak - a.streak;
            return b.level - a.level;
        });

        // Guardar ranking actualizado
        localStorage.setItem('userRanking', JSON.stringify(ranking));

        return ranking;
    }
    startLesson(lessonNumber) {
        // Check if user has hearts
        if (this.hearts <= 0) {
            this.showNoHeartsModal();
            return;
        }

        // Redirect to lesson page
        const lessonUrls = {
            1: 'nivel_1.html',
            2: 'nivel_2.html',
            3: 'nivel_3.html',
            4: 'nivel_4.html',
            5: 'nivel_5.html'
        };

        if (lessonUrls[lessonNumber]) {
            window.location.href = lessonUrls[lessonNumber];
        }
    }

    startPractice(type) {
        const practiceTypes = ['review', 'challenge', 'lessons'];

        switch (type) {
            case 0: // Repasar
                this.showReviewOptions();
                break;
            case 1: // Desafíos
                this.showChallengeOptions();
                break;
            case 2: // Lecciones
                this.showLessonsLibrary();
                break;
        }
    }

    showReviewOptions() {
        const modal = this.createModal('Repasar Lecciones', `
            <div class="review-options">
                <h3>¿Qué quieres repasar?</h3>
                <div class="review-grid">
                    <div class="review-card" data-topic="regular-verbs">
                        <i class="fas fa-book"></i>
                        <h4>Verbos Regulares</h4>
                        <p>Past Simple</p>
                    </div>
                    <div class="review-card" data-topic="irregular-verbs">
                        <i class="fas fa-book"></i>
                        <h4>Verbos Irregulares</h4>
                        <p>Past Simple</p>
                    </div>
                    <div class="review-card" data-topic="present-continuous">
                        <i class="fas fa-book"></i>
                        <h4>Presente Continuo</h4>
                        <p>Present Continuous</p>
                    </div>
                    <div class="review-card" data-topic="future-simple">
                        <i class="fas fa-book"></i>
                        <h4>Futuro Simple</h4>
                        <p>Future Simple</p>
                    </div>
                    <div class="review-card" data-topic="conditionals">
                        <i class="fas fa-book"></i>
                        <h4>Condicionales</h4>
                        <p>Conditionals</p>
                    </div>
                    <div class="review-card" data-topic="mixed">
                        <i class="fas fa-random"></i>
                        <h4>Mixto</h4>
                        <p>Todos los temas</p>
                    </div>
                </div>
            </div>
        `);

        // Add event listeners to review cards
        modal.querySelectorAll('.review-card').forEach(card => {
            card.addEventListener('click', () => {
                const topic = card.dataset.topic;
                // Redirect to specific review page
                const reviewPages = {
                    'regular-verbs': 'repaso_verbos_regulares.html',
                    'irregular-verbs': 'repaso_verbos_irregulares.html',
                    'present-continuous': 'repaso_presente_continuo.html',
                    'future-simple': 'repaso_futuro_simple.html',
                    'conditionals': 'repaso_condicionales.html',
                    'mixed': 'repaso_mixto.html'
                };
                
                const page = reviewPages[topic];
                if (page) {
                    window.location.href = page;
                } else {
                    console.error('Página de repaso no encontrada:', topic);
                }
                modal.remove();
            });
        });

        document.body.appendChild(modal);
    }

    showChallengeOptions() {
        const modal = this.createModal('Desafíos', `
            <div class="challenge-options">
                <h3>Elige tu desafío</h3>
                <div class="challenge-grid">
                    <div class="challenge-card" data-challenge="speed">
                        <i class="fas fa-stopwatch"></i>
                        <h4>Desafío de Velocidad</h4>
                        <p>Responde 10 preguntas en 60 segundos</p>
                        <div class="challenge-reward">+2 Corazones</div>
                    </div>
                    <div class="challenge-card" data-challenge="accuracy">
                        <i class="fas fa-bullseye"></i>
                        <h4>Desafío de Precisión</h4>
                        <p>Responde 15 preguntas con 100% de precisión</p>
                        <div class="challenge-reward">+3 Corazones</div>
                    </div>
                    <div class="challenge-card" data-challenge="endurance">
                        <i class="fas fa-dumbbell"></i>
                        <h4>Desafío de Resistencia</h4>
                        <p>Responde 25 preguntas seguidas</p>
                        <div class="challenge-reward">+5 Corazones</div>
                    </div>
                    <div class="challenge-card" data-challenge="daily">
                        <i class="fas fa-calendar-day"></i>
                        <h4>Desafío Diario</h4>
                        <p>Completa 5 lecciones diferentes hoy</p>
                        <div class="challenge-reward">+1 Corazón</div>
                    </div>
                </div>
            </div>
        `);

        // Add event listeners to challenge cards
        modal.querySelectorAll('.challenge-card').forEach(card => {
            card.addEventListener('click', () => {
                const challenge = card.dataset.challenge;
                // Redirect to specific challenge page
                const challengePages = {
                    'speed': 'desafio_velocidad.html',
                    'accuracy': 'desafio_precision.html',
                    'endurance': 'desafio_resistencia.html',
                    'daily': 'desafio_diario.html',
                    'grammar': 'desafio_gramatica.html',
                    'vocabulary': 'desafio_vocabulario.html'
                };
                
                const page = challengePages[challenge];
                if (page) {
                    window.location.href = page;
                } else {
                    console.error('Página de desafío no encontrada:', challenge);
                }
                modal.remove();
            });
        });

        document.body.appendChild(modal);
    }

    showLessonsLibrary() {
        const modal = this.createModal('Biblioteca de Lecciones', `
            <div class="lessons-library">
                <div class="search-bar">
                    <input type="text" id="lesson-search" placeholder="Buscar lección...">
                    <i class="fas fa-search"></i>
                </div>
                <div class="lessons-grid">
                    <div class="lesson-item" data-lesson="grammar-basics">
                        <i class="fas fa-language"></i>
                        <h4>Gramática Básica</h4>
                        <p>Conceptos fundamentales del inglés</p>
                    </div>
                    <div class="lesson-item" data-lesson="pronunciation">
                        <i class="fas fa-volume-up"></i>
                        <h4>Pronunciación</h4>
                        <p>Mejora tu pronunciación en inglés</p>
                    </div>
                    <div class="lesson-item" data-lesson="vocabulary">
                        <i class="fas fa-book-open"></i>
                        <h4>Vocabulario</h4>
                        <p>Amplía tu vocabulario</p>
                    </div>
                    <div class="lesson-item" data-lesson="conversation">
                        <i class="fas fa-comments"></i>
                        <h4>Conversación</h4>
                        <p>Frases útiles para conversar</p>
                    </div>
                    <div class="lesson-item" data-lesson="business-english">
                        <i class="fas fa-briefcase"></i>
                        <h4>Inglés de Negocios</h4>
                        <p>Expresiones para el trabajo</p>
                    </div>
                    <div class="lesson-item" data-lesson="travel-english">
                        <i class="fas fa-plane"></i>
                        <h4>Inglés para Viajes</h4>
                        <p>Frases para viajar</p>
                    </div>
                </div>
            </div>
        `);

        // Add search functionality
        const searchInput = modal.querySelector('#lesson-search');
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const lessonItems = modal.querySelectorAll('.lesson-item');

            lessonItems.forEach(item => {
                const title = item.querySelector('h4').textContent.toLowerCase();
                const description = item.querySelector('p').textContent.toLowerCase();

                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });

        // Add event listeners to lesson items
        modal.querySelectorAll('.lesson-item').forEach(item => {
            item.addEventListener('click', () => {
                const lesson = item.dataset.lesson;
                this.openLesson(lesson);
                modal.remove();
            });
        });

        document.body.appendChild(modal);
    }

    createModal(title, content) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        modal.innerHTML = `
            <div style="
                background: white;
                padding: 30px;
                border-radius: 20px;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="margin: 0; color: #333;">${title}</h2>
                    <button onclick="this.closest('.modal').remove()" style="
                        background: none;
                        border: none;
                        font-size: 24px;
                        cursor: pointer;
                        color: #666;
                    ">×</button>
                </div>
                ${content}
            </div>
        `;

        modal.className = 'modal';
        return modal;
    }
    showReviewExercise() {
        if (!this.currentReviewSession) return;

        const session = this.currentReviewSession;
        if (session.currentIndex >= session.exercises.length) {
            this.completeReviewSession();
            return;
        }

        const exercise = session.exercises[session.currentIndex];
        const content = document.getElementById('review-content');

        content.innerHTML = `
            <div class="review-exercise">
                <div class="review-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(session.currentIndex / session.exercises.length) * 100}%"></div>
                    </div>
                    <div class="progress-text">
                        Ejercicio ${session.currentIndex + 1} de ${session.exercises.length}
                    </div>
                </div>
                
                <div class="review-question">
                    <h3>${exercise.question}</h3>
                    <div id="review-options"></div>
                </div>
            </div>
        `;

        // Renderizar opciones
        const optionsContainer = document.getElementById('review-options');
        this.renderReviewOptions(exercise, optionsContainer, session);
    }

    renderReviewOptions(exercise, container, session) {
        container.innerHTML = '';

        if (exercise.type === 'multiple_choice') {
            exercise.options.forEach((option, index) => {
                const button = document.createElement('button');
                button.className = 'review-option-button';
                button.textContent = option;
                button.onclick = () => this.handleReviewAnswer(option === exercise.correct, exercise, session);
                container.appendChild(button);
            });
        } else if (exercise.type === 'fill_blank') {
            const inputContainer = document.createElement('div');
            inputContainer.className = 'review-input-container';

            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'review-input';
            input.placeholder = 'Escribe tu respuesta...';

            const submitButton = document.createElement('button');
            submitButton.className = 'review-submit-button';
            submitButton.textContent = 'Verificar';
            submitButton.onclick = () => {
                const answer = input.value.trim().toLowerCase();
                const correct = exercise.correct.toLowerCase();
                this.handleReviewAnswer(answer === correct, exercise, session);
            };

            inputContainer.appendChild(input);
            inputContainer.appendChild(submitButton);
            container.appendChild(inputContainer);

            // Permitir envío con Enter
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    submitButton.click();
                }
            });
        } else if (exercise.type === 'translation') {
            const inputContainer = document.createElement('div');
            inputContainer.className = 'review-input-container';

            const input = document.createElement('textarea');
            input.className = 'review-input';
            input.placeholder = 'Escribe tu traducción...';
            input.rows = 3;

            const submitButton = document.createElement('button');
            submitButton.className = 'review-submit-button';
            submitButton.textContent = 'Verificar';
            submitButton.onclick = () => {
                const answer = input.value.trim().toLowerCase();
                const correct = exercise.correct.toLowerCase();
                const alternatives = exercise.alternatives?.map(alt => alt.toLowerCase()) || [];
                const isCorrect = answer === correct || alternatives.includes(answer);
                this.handleReviewAnswer(isCorrect, exercise, session);
            };

            inputContainer.appendChild(input);
            inputContainer.appendChild(submitButton);
            container.appendChild(inputContainer);
        }
    }

    handleReviewAnswer(isCorrect, exercise, session) {
        if (isCorrect) {
            session.score++;
            this.showReviewFeedback('¡Correcto! 🎉', 'correct');
        } else {
            this.showReviewFeedback(`Incorrecto. La respuesta correcta es: ${exercise.correct}`, 'incorrect');
        }

        // Deshabilitar opciones
        const buttons = document.querySelectorAll('.review-option-button, .review-submit-button');
        buttons.forEach(btn => btn.disabled = true);

        // Mostrar explicación
        this.showReviewExplanation(exercise.explanation);

        // Continuar después de un delay
        setTimeout(() => {
            session.currentIndex++;
            document.querySelector('.modal').remove();
            this.showReviewExercise();
        }, 3000);
    }

    showReviewFeedback(message, type) {
        const feedback = document.createElement('div');
        feedback.textContent = message;
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${type === 'correct' ? '#3B82F6' : '#ff6b6b'};
            color: white;
            padding: 15px 25px;
            border-radius: 12px;
            font-weight: 600;
            z-index: 10001;
            animation: feedbackShow 2s ease-out forwards;
        `;

        document.body.appendChild(feedback);
        setTimeout(() => feedback.remove(), 2000);
    }

    showReviewExplanation(explanation) {
        const explanationDiv = document.createElement('div');
        explanationDiv.className = 'review-explanation';
        explanationDiv.innerHTML = `
            <div style="
                background: #f0f8ff;
                border: 2px solid #3B82F6;
                border-radius: 12px;
                padding: 15px;
                margin: 15px 0;
                color: #333;
                font-style: italic;
            ">
                💡 ${explanation}
            </div>
        `;

        document.querySelector('#review-options').appendChild(explanationDiv);
    }

    completeReviewSession() {
        const session = this.currentReviewSession;
        const accuracy = (session.score / session.exercises.length) * 100;

        this.addXP(session.xpReward);

        const modal = this.createModal('Repaso Completado', `
            <div class="review-complete">
                <div style="font-size: 60px; margin-bottom: 20px;">🎉</div>
                <h3>¡Repaso completado!</h3>
                <p>Puntuación: ${session.score} / ${session.exercises.length}</p>
                <p>Precisión: ${Math.round(accuracy)}%</p>
                <p>XP ganado: +${session.xpReward}</p>
                <button class="action-button" onclick="this.closest('.modal').remove()">
                    Continuar
                </button>
            </div>
        `);
        document.body.appendChild(modal);

        this.currentReviewSession = null;
    }

    openLesson(lessonType) {
        const lessonContent = this.getLessonContent(lessonType);
        const modal = this.createModal(lessonContent.title, `
            <div class="lesson-content">
                <div class="lesson-header">
                    <i class="${lessonContent.icon}"></i>
                    <h3>${lessonContent.title}</h3>
                </div>
                <div class="lesson-body">
                    ${lessonContent.content}
                </div>
                <div class="lesson-footer">
                    <button class="action-button" onclick="this.closest('.modal').remove()">
                        Cerrar
                    </button>
                </div>
            </div>
        `);
        document.body.appendChild(modal);
    }

    getLessonContent(lessonType) {
        const lessonContents = {
            'grammar-basics': {
                title: 'Gramática Básica',
                icon: 'fas fa-language',
                content: `
                    <h4>Conceptos Fundamentales</h4>
                    <ul>
                        <li><strong>Sustantivos:</strong> Palabras que nombran personas, lugares o cosas</li>
                        <li><strong>Verbos:</strong> Palabras que expresan acciones o estados</li>
                        <li><strong>Adjetivos:</strong> Palabras que describen sustantivos</li>
                        <li><strong>Adverbios:</strong> Palabras que modifican verbos, adjetivos u otros adverbios</li>
                    </ul>
                    <h4>Estructura de Oración</h4>
                    <p>Sujeto + Verbo + Complemento</p>
                    <p>Ejemplo: "I eat apples" (Yo como manzanas)</p>
                `
            },
            'pronunciation': {
                title: 'Pronunciación',
                icon: 'fas fa-volume-up',
                content: `
                    <h4>Consejos para Mejorar la Pronunciación</h4>
                    <ul>
                        <li>Escucha música en inglés</li>
                        <li>Repite después de videos o podcasts</li>
                        <li>Practica con aplicaciones de pronunciación</li>
                        <li>Habla con nativos si es posible</li>
                    </ul>
                    <h4>Sonidos Difíciles</h4>
                    <p>Practica especialmente los sonidos que no existen en español</p>
                `
            },
            'vocabulary': {
                title: 'Vocabulario',
                icon: 'fas fa-book-open',
                content: `
                    <h4>Estrategias para Aprender Vocabulario</h4>
                    <ul>
                        <li>Usa tarjetas de memoria (flashcards)</li>
                        <li>Asocia palabras con imágenes</li>
                        <li>Practica en contexto</li>
                        <li>Repite regularmente</li>
                    </ul>
                    <h4>Palabras Más Comunes</h4>
                    <p>Enfócate en las 1000 palabras más usadas en inglés</p>
                `
            },
            'conversation': {
                title: 'Conversación',
                icon: 'fas fa-comments',
                content: `
                    <h4>Frases Útiles para Conversar</h4>
                    <ul>
                        <li>"How are you?" - ¿Cómo estás?</li>
                        <li>"Nice to meet you" - Mucho gusto</li>
                        <li>"What do you do?" - ¿A qué te dedicas?</li>
                        <li>"Where are you from?" - ¿De dónde eres?</li>
                    </ul>
                    <h4>Consejos para Conversar</h4>
                    <p>No tengas miedo de cometer errores, es parte del aprendizaje</p>
                `
            },
            'business-english': {
                title: 'Inglés de Negocios',
                icon: 'fas fa-briefcase',
                content: `
                    <h4>Expresiones de Negocios</h4>
                    <ul>
                        <li>"Let's schedule a meeting" - Programemos una reunión</li>
                        <li>"I'll send you an email" - Te enviaré un correo</li>
                        <li>"What's the deadline?" - ¿Cuál es la fecha límite?</li>
                        <li>"I need to follow up" - Necesito hacer seguimiento</li>
                    </ul>
                    <h4>Consejos Profesionales</h4>
                    <p>Mantén un tono formal y profesional en comunicaciones de trabajo</p>
                `
            },
            'travel-english': {
                title: 'Inglés para Viajes',
                icon: 'fas fa-plane',
                content: `
                    <h4>Frases para Viajar</h4>
                    <ul>
                        <li>"Where is the airport?" - ¿Dónde está el aeropuerto?</li>
                        <li>"How much does it cost?" - ¿Cuánto cuesta?</li>
                        <li>"Can you help me?" - ¿Puedes ayudarme?</li>
                        <li>"I'm lost" - Estoy perdido</li>
                    </ul>
                    <h4>Consejos para Viajar</h4>
                    <p>Lleva un diccionario de bolsillo o usa una app de traducción</p>
                `
            }
        };
        return lessonContents[lessonType] || {
            title: 'Lección',
            icon: 'fas fa-book',
            content: 'Contenido no disponible'
        };
    }

    showNoHeartsModal() {
        // Create modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        modal.innerHTML = `
            <div style="
                background: white;
                padding: 40px;
                border-radius: 20px;
                text-align: center;
                max-width: 400px;
                margin: 20px;
            ">
                <div style="font-size: 60px; margin-bottom: 20px;">💔</div>
                <h2 style="color: #333; margin-bottom: 15px;">¡Sin corazones!</h2>
                <p style="color: #666; margin-bottom: 25px;">
                    Has perdido todos tus corazones. Espera a que se regeneren o practica para ganar más.
                </p>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button onclick="this.closest('.modal').remove()" style="
                        background: #3B82F6;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 12px;
                        cursor: pointer;
                        font-weight: 600;
                    ">Entendido</button>
                    <button onclick="duolingoApp.buyHearts()" style="
                        background: #ff6b6b;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 12px;
                        cursor: pointer;
                        font-weight: 600;
                    ">Comprar (Próximamente)</button>
                </div>
            </div>
        `;

        modal.className = 'modal';
        document.body.appendChild(modal);
    }

    buyHearts() {
        // In a real app, this would integrate with a payment system
        alert('Función de compra de corazones próximamente disponible');
    }

    loseHeart() {
        if (this.hearts > 0) {
            this.hearts--;
            localStorage.setItem('hearts', this.hearts);
            this.updateStats();
            this.updateHeartsDisplay();
        }
    }

    gainHeart() {
        if (this.hearts < this.maxHearts) {
            this.hearts++;
            localStorage.setItem('hearts', this.hearts);
            this.updateStats();
            this.updateHeartsDisplay();
        }
    }

    updateHeartsDisplay() {
        const heartsElement = document.getElementById('hearts');
        if (heartsElement) {
        }
    }

    addXP(amount) {
        const delta = Number(amount) || 0;
        this.xp = Number(this.xp) + delta;
        const today = new Date().toDateString();
        if (this.lastActivityDate !== today) {
            this.currentProgress = 0;
        }

        this.currentProgress = Number(this.currentProgress) + delta;
        this.saveUserData();
        this.updateStats();
        // Verificar si se cumplió la meta diaria tras ganar XP
        this.checkDailyGoal();
        // Tracking opcional
        if (window.databaseIntegration) {
            window.databaseIntegration.trackEvent('xp_gained', {
                amount: delta,
                totalXP: Number(this.xp),
                source: 'lesson_or_review'
            });
        }
    }

    checkDailyGoal() {
        if (this.currentProgress >= this.dailyGoal) {
            // Verificar si ya se completó la meta diaria hoy
            const today = new Date().toDateString();
            const lastDailyGoalCompletion = localStorage.getItem('lastDailyGoalCompletion');

            if (lastDailyGoalCompletion !== today) {
                this.completeDailyGoal();
                localStorage.setItem('lastDailyGoalCompletion', today);
            }
        }
    }

    completeDailyGoal() {
        // Add bonus XP for completing daily goal
        this.addXP(10);

        // Update last activity date when completing daily goal
        const today = new Date().toDateString();

        // Si es la primera vez completando meta diaria, iniciar racha en 1
        if (this.streak === 0) {
            this.streak = 1;
        }

        this.lastActivityDate = today;
        this.saveUserData();
        this.updateStats();

        // Show celebration
        this.showDailyGoalComplete();
    }

    showDailyGoalComplete() {
        const celebration = document.createElement('div');
        celebration.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #3B82F6, #60A5FA);
            color: white;
            padding: 30px;
            border-radius: 20px;
            text-align: center;
            z-index: 10000;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        `;

        celebration.innerHTML = `
            <div style="font-size: 60px; margin-bottom: 15px;">🎉</div>
            <h2 style="margin-bottom: 10px;">¡Meta diaria completada!</h2>
            <p style="margin-bottom: 15px;">+10 XP de bonificación</p>
            <p style="font-size: 14px; opacity: 0.9;">Racha: ${this.streak} días</p>
        `;

        document.body.appendChild(celebration);
        setTimeout(() => celebration.remove(), 3000);
    }

    loadUserProgress() {
        // Use in-memory merged list for consistency
        const completedLessons = Array.isArray(this.completedLessons) ? this.completedLessons : [];

        completedLessons.forEach(lessonNumber => {
            const lessonCard = document.querySelector(`[data-lesson="${lessonNumber}"]`);
            if (lessonCard) {
                lessonCard.classList.remove('locked');
                lessonCard.querySelector('.lesson-status i').className = 'fas fa-check';

                // Mark all dots as completed
                const dots = lessonCard.querySelectorAll('.dot');
                dots.forEach(dot => dot.classList.add('completed'));
            }
        });

        // Unlock next lessons and refresh cards
        this.unlockNextLessons();
        this.updateLessonCards();
    }

    updateLessonCards() {
        const maxLesson = 5; // total lessons
        const completedSet = new Set(this.completedLessons);

        for (let i = 1; i <= maxLesson; i++) {
            const lessonCard = document.querySelector(`[data-lesson="${i}"]`);
            if (!lessonCard) continue;
            const config = getLevelConfig(i);

            // Titles/subtitles/xp
            if (config) {
                const titleElement = lessonCard.querySelector('h4');
                const subtitleElement = lessonCard.querySelector('p');
                if (titleElement) titleElement.textContent = config.title;
                if (subtitleElement) subtitleElement.textContent = config.subtitle;
                const xpElement = lessonCard.querySelector('.xp-reward');
                if (xpElement) xpElement.textContent = `+${config.xpReward} XP`;
            }

            // Lock/unlock state usando la función isLevelUnlocked
            const isUnlocked = isLevelUnlocked(i);
            if (isUnlocked) {
                lessonCard.classList.remove('locked');
                const statusIcon = lessonCard.querySelector('.lesson-status i');
                if (statusIcon) statusIcon.className = completedSet.has(i) ? 'fas fa-check' : 'fas fa-unlock';
                // Ensure click handler starts lesson
                lessonCard.onclick = () => this.startLesson(i);
            } else {
                lessonCard.classList.add('locked');
                const statusIcon = lessonCard.querySelector('.lesson-status i');
                if (statusIcon) statusIcon.className = 'fas fa-lock';
                lessonCard.onclick = null;
            }

            // Completed dots
            const dots = lessonCard.querySelectorAll('.dot');
            dots.forEach(dot => dot.classList.toggle('completed', completedSet.has(i)));
        }
    }

    unlockNextLessons() {
        // Usar la función isLevelUnlocked para verificar qué niveles deben desbloquearse
        for (let i = 1; i <= 5; i++) {
            if (isLevelUnlocked(i)) {
                const lessonCard = document.querySelector(`[data-lesson="${i}"]`);
                if (lessonCard && lessonCard.classList.contains('locked')) {
                    lessonCard.classList.remove('locked');
                    lessonCard.onclick = () => this.startLesson(i);
                    const statusIcon = lessonCard.querySelector('.lesson-status i');
                    if (statusIcon && !this.completedLessons.includes(i)) {
                        statusIcon.className = 'fas fa-unlock';
                    }
                }
            }
        }
    }

    completeLesson(lessonNumber) {
        // Mark lesson as completed
        if (!this.completedLessons.includes(lessonNumber)) {
            this.completedLessons.push(lessonNumber);
        }

        // XP ya fue otorgado desde la página del nivel; evitar duplicar aquí

        // Update level if necessary
        this.updateLevel();

        // Unlock next lesson
        this.unlockNextLessons();

        // Update lesson cards
        this.updateLessonCards();

        // Save user data
        this.saveUserData();

        // Track lesson completion
        if (window.databaseIntegration) {
            window.databaseIntegration.trackEvent('lesson_completed', {
                lessonNumber: lessonNumber,
                totalCompleted: this.completedLessons.length,
                xpGained: 10
            });
        }
    }

    updateLevel() {
        const newLevel = Math.floor(this.xp / 100) + 1;
        if (newLevel > this.level) {
            this.level = newLevel;
            this.showLevelUpNotification();
        }
    }

    showLevelUpNotification() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #ffd700, #ffed4e);
            color: #333;
            padding: 30px;
            border-radius: 20px;
            text-align: center;
            z-index: 10000;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        `;

        notification.innerHTML = `
            <div style="font-size: 60px; margin-bottom: 15px;">🎉</div>
            <h2 style="margin-bottom: 10px;">¡Nivel ${this.level}!</h2>
            <p style="font-size: 16px; margin: 0;">¡Felicidades! Has subido de nivel</p>
        `;

        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 4000);
    }
}

// Initialize the app when DOM is loaded

document.addEventListener('DOMContentLoaded', () => {
    window.duolingoApp = new DuolingoApp();
});

// Heart regeneration system
setInterval(() => {
    if (window.duolingoApp && window.duolingoApp.hearts < window.duolingoApp.maxHearts) {
        const lastHeartTime = parseInt(localStorage.getItem('lastHeartTime')) || Date.now();
        const timeSinceLastHeart = Date.now() - lastHeartTime;
        const heartRegenTime = 5 * 60 * 1000; // 5 minutes in milliseconds

        if (timeSinceLastHeart >= heartRegenTime) {
            window.duolingoApp.gainHeart();
            localStorage.setItem('lastHeartTime', Date.now());
        }
    }
}, 60000); // Check every minute

// Daily reset
function checkDailyReset() {
    const lastReset = localStorage.getItem('lastDailyReset');
    const today = new Date().toDateString();

    if (lastReset !== today) {
        // Reset daily progress
        localStorage.setItem('dailyProgress', '0');
        localStorage.setItem('lastDailyReset', today);

        // Regenerate all hearts
        if (window.duolingoApp) {
            window.duolingoApp.hearts = window.duolingoApp.maxHearts;
            localStorage.setItem('hearts', window.duolingoApp.hearts);
            window.duolingoApp.updateStats();
        }
    }
}

// Check for daily reset on page load
checkDailyReset();