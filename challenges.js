// Sistema de Desafíos - Class Vanni
class ChallengeSystem {
    constructor() {
        this.challenges = {
            speed: {
                id: 'speed',
                name: 'Desafío de Velocidad',
                description: 'Responde 10 preguntas en 60 segundos',
                icon: 'fas fa-stopwatch',
                timeLimit: 60,
                questionCount: 10,
                heartReward: 2,
                xpReward: 20,
                difficulty: 'Fácil',
                color: '#3B82F6'
            },
            accuracy: {
                id: 'accuracy',
                name: 'Desafío de Precisión',
                description: 'Responde 15 preguntas con 100% de precisión',
                icon: 'fas fa-bullseye',
                timeLimit: null,
                questionCount: 15,
                requiredAccuracy: 100,
                heartReward: 3,
                xpReward: 30,
                difficulty: 'Intermedio',
                color: '#ff6b6b'
            },
            endurance: {
                id: 'endurance',
                name: 'Desafío de Resistencia',
                description: 'Responde 25 preguntas seguidas',
                icon: 'fas fa-dumbbell',
                timeLimit: null,
                questionCount: 25,
                heartReward: 5,
                xpReward: 50,
                difficulty: 'Difícil',
                color: '#4ecdc4'
            },
            daily: {
                id: 'daily',
                name: 'Desafío Diario',
                description: 'Completa 5 lecciones diferentes hoy',
                icon: 'fas fa-calendar-day',
                timeLimit: null,
                questionCount: 5,
                heartReward: 1,
                xpReward: 15,
                difficulty: 'Fácil',
                color: '#a8e6cf'
            },
            grammar: {
                id: 'grammar',
                name: 'Desafío de Gramática',
                description: 'Responde 20 preguntas de gramática',
                icon: 'fas fa-language',
                timeLimit: null,
                questionCount: 20,
                heartReward: 4,
                xpReward: 40,
                difficulty: 'Intermedio',
                color: '#ffd93d'
            },
            vocabulary: {
                id: 'vocabulary',
                name: 'Desafío de Vocabulario',
                description: 'Responde 18 preguntas de vocabulario',
                icon: 'fas fa-book-open',
                timeLimit: null,
                questionCount: 18,
                heartReward: 3,
                xpReward: 35,
                difficulty: 'Intermedio',
                color: '#ff8e8e'
            }
        };
    }
    // Obtener desafío por ID
    getChallenge(id) {
        return this.challenges[id];
    }
    // Renderizar pregunta del desafío
    renderChallengeQuestion(session) {
        const content = document.getElementById('challenge-content');
        const question = session.questions[session.currentQuestion];

        content.innerHTML = `
            <div class="challenge-exercise">
                <div class="challenge-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(session.currentQuestion / session.questions.length) * 100}%"></div>
                    </div>
                    <div class="progress-text">
                        Pregunta ${session.currentQuestion + 1} de ${session.questions.length}
                    </div>
                    ${session.challenge.timeLimit ? `
                        <div class="timer">
                            <i class="fas fa-clock"></i>
                            <span id="challenge-timer">${session.challenge.timeLimit}</span>
                        </div>
                    ` : ''}
                </div>
                
                <div class="challenge-question">
                    <h3>${question.question}</h3>
                    <div id="challenge-options"></div>
                </div>
            </div>
        `;

        // Renderizar opciones
        this.renderChallengeOptions(question, session);

        // Configurar timer si es necesario
        if (session.challenge.timeLimit) {
            this.startChallengeTimer(session);
        }
    }

    // Renderizar opciones del desafío
    renderChallengeOptions(question, session) {
        const optionsContainer = document.getElementById('challenge-options');
        optionsContainer.innerHTML = '';

        if (question.type === 'multiple_choice') {
            question.options.forEach((option) => {
                const button = document.createElement('button');
                button.className = 'challenge-option-button';
                button.textContent = option;
                button.onclick = () => this.handleChallengeAnswer(option === question.correct, question, session);
                optionsContainer.appendChild(button);
            });
        } else if (question.type === 'fill_blank') {
            const inputContainer = document.createElement('div');
            inputContainer.className = 'challenge-input-container';

            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'challenge-input';
            input.placeholder = 'Escribe tu respuesta...';

            const submitButton = document.createElement('button');
            submitButton.className = 'challenge-submit-button';
            submitButton.textContent = 'Verificar';
            submitButton.onclick = () => {
                const answer = input.value.trim().toLowerCase();
                const correct = question.correct.toLowerCase();
                this.handleChallengeAnswer(answer === correct, question, session);
            };

            inputContainer.appendChild(input);
            inputContainer.appendChild(submitButton);
            optionsContainer.appendChild(inputContainer);

            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    submitButton.click();
                }
            });
        } else if (question.type === 'translation') {
            const inputContainer = document.createElement('div');
            inputContainer.className = 'challenge-input-container';

            const input = document.createElement('textarea');
            input.className = 'challenge-input';
            input.placeholder = 'Escribe tu traducción...';
            input.rows = 3;

            const submitButton = document.createElement('button');
            submitButton.className = 'challenge-submit-button';
            submitButton.textContent = 'Verificar';
            submitButton.onclick = () => {
                const answer = input.value.trim().toLowerCase();
                const correct = question.correct.toLowerCase();
                const alternatives = question.alternatives?.map(alt => alt.toLowerCase()) || [];
                const isCorrect = answer === correct || alternatives.includes(answer);
                this.handleChallengeAnswer(isCorrect, question, session);
            };

            inputContainer.appendChild(input);
            inputContainer.appendChild(submitButton);
            optionsContainer.appendChild(inputContainer);
        }
    }

    // Manejar respuesta del desafío
    handleChallengeAnswer(isCorrect, question, session) {
        // Deshabilitar opciones
        const buttons = document.querySelectorAll('.challenge-option-button, .challenge-submit-button');
        buttons.forEach(btn => btn.disabled = true);

        if (isCorrect) {
            session.correctAnswers++;
            session.score += 10;
            this.showChallengeFeedback('¡Correcto! 🎉', 'correct');
        } else {
            this.showChallengeFeedback(`Incorrecto. La respuesta correcta es: ${question.correct}`, 'incorrect');
        }

        // Guardar respuesta
        session.answers.push({
            question: question.question,
            correct: question.correct,
            userAnswer: isCorrect,
            time: Date.now() - session.startTime
        });

        // Continuar después de un delay
        setTimeout(() => {
            session.currentQuestion++;
            if (session.currentQuestion >= session.questions.length) {
                this.completeChallenge(session);
            } else {
                this.renderChallengeQuestion(session);
            }
        }, 2000);
    }

    // Mostrar feedback del desafío
    showChallengeFeedback(message, type) {
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

    // Completar desafío
    completeChallenge(session) {
        const accuracy = (session.correctAnswers / session.questions.length) * 100;
        const timeSpent = Math.round((Date.now() - session.startTime) / 1000);

        // Verificar si cumplió los requisitos
        let success = true;
        if (session.challenge.requiredAccuracy && accuracy < session.challenge.requiredAccuracy) {
            success = false;
        }

        const content = document.getElementById('challenge-content');
        content.innerHTML = `
            <div class="challenge-complete">
                <div style="font-size: 60px; margin-bottom: 20px;">${success ? '🏆' : '💔'}</div>
                <h3>${success ? '¡Desafío completado!' : 'Desafío fallido'}</h3>
                <p>Puntuación: ${session.correctAnswers} / ${session.questions.length}</p>
                <p>Precisión: ${Math.round(accuracy)}%</p>
                <p>Tiempo: ${timeSpent} segundos</p>
                ${success ? `
                    <p>Corazones ganados: +${session.challenge.heartReward}</p>
                    <p>XP ganado: +${session.challenge.xpReward}</p>
                ` : '<p>Inténtalo de nuevo</p>'}
                <button class="action-button" onclick="this.closest('#challenge-container').remove()">
                    ${success ? 'Continuar' : 'Reintentar'}
                </button>
            </div>
        `;

        // Dar recompensas si fue exitoso
        if (success && window.duolingoApp) {
            window.duolingoApp.hearts += session.challenge.heartReward;
            window.duolingoApp.addXP(session.challenge.xpReward);
            window.duolingoApp.updateStats();
        }
    }

    // Iniciar timer del desafío
    startChallengeTimer(session) {
        let timeLeft = session.challenge.timeLimit;
        const timerElement = document.getElementById('challenge-timer');

        const timer = setInterval(() => {
            timeLeft--;
            if (timerElement) {
                timerElement.textContent = timeLeft;
            }

            if (timeLeft <= 0) {
                clearInterval(timer);
                this.completeChallenge(session);
            }
        }, 1000);

        session.timer = timer;
    }
}

// Inicializar sistema de desafíos
window.challengeSystem = new ChallengeSystem();
