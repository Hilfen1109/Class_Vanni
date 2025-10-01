// Motor de ejercicios dinámico - Estilo Duolingo
class ExerciseEngine {
    constructor(levelNumber) {
        this.levelNumber = levelNumber;
        this.config = getLevelConfig(levelNumber);
        this.currentExerciseIndex = 0;
        this.score = 0;
        this.heartsLost = 0;
        this.startTime = Date.now();
    }

    // Renderizar ejercicio actual
    renderCurrentExercise() {
        if (this.currentExerciseIndex >= this.config.exercises.length) {
            this.completeLevel();
            return;
        }

        const exercise = this.config.exercises[this.currentExerciseIndex];
        this.renderExercise(exercise);
        this.updateProgress();

        // Asegurar que el contenedor de opciones esté visible
        const optionsContainer = document.getElementById('options-container');
        if (optionsContainer) {
            optionsContainer.style.display = 'block';
        }
    }

    // Renderizar ejercicio específico
    renderExercise(exercise) {
        const questionContainer = document.getElementById('question-container');
        const optionsContainer = document.getElementById('options-container');
        const mediaContainer = document.getElementById('question-media');

        // Limpiar contenedores
        questionContainer.innerHTML = '';
        optionsContainer.innerHTML = '';
        mediaContainer.innerHTML = '';

        // Renderizar pregunta
        const questionElement = document.createElement('h2');
        questionElement.className = 'question-text';
        questionElement.textContent = exercise.question;
        questionContainer.appendChild(questionElement);

        // Renderizar según el tipo de ejercicio
        switch (exercise.type) {
            case 'multiple_choice':
                this.renderMultipleChoice(exercise, optionsContainer);
                break;
            case 'fill_blank':
                this.renderFillBlank(exercise, optionsContainer);
                break;
            case 'translation':
                this.renderTranslation(exercise, optionsContainer);
                break;
            case 'matching':
                this.renderMatching(exercise, optionsContainer);
                break;
            case 'sentence_construction':
                this.renderSentenceConstruction(exercise, optionsContainer);
                break;
            case 'listening':
                this.renderListening(exercise, optionsContainer, mediaContainer);
                break;
            case 'dialogue':
                this.renderDialogue(exercise, optionsContainer);
                break;
            case 'mixed_exercise':
                this.renderMixedExercise(exercise, optionsContainer);
                break;
        }
    }

    // Ejercicio de opción múltiple
    renderMultipleChoice(exercise, container) {
        exercise.options.forEach((option, _index) => {
            const button = document.createElement('button');
            button.className = 'option-button';
            button.textContent = option;
            button.onclick = () => this.handleAnswer(option === exercise.correct, exercise);
            container.appendChild(button);
        });
    }

    // Ejercicio de llenar espacios
    renderFillBlank(exercise, container) {
        const inputContainer = document.createElement('div');
        inputContainer.className = 'fill-blank-container';

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'fill-blank-input';
        input.placeholder = 'Escribe tu respuesta aquí...';

        const submitButton = document.createElement('button');
        submitButton.className = 'action-button';
        submitButton.textContent = 'Verificar';
        submitButton.onclick = () => {
            const answer = input.value.trim().toLowerCase();
            const correct = exercise.correct.toLowerCase();
            this.handleAnswer(answer === correct, exercise, answer);
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
    }

    // Ejercicio de traducción
    renderTranslation(exercise, container) {
        const inputContainer = document.createElement('div');
        inputContainer.className = 'translation-container';

        const input = document.createElement('textarea');
        input.className = 'translation-input';
        input.placeholder = 'Escribe tu traducción aquí...';
        input.rows = 3;

        const submitButton = document.createElement('button');
        submitButton.className = 'action-button';
        submitButton.textContent = 'Verificar';
        submitButton.onclick = () => {
            const answer = input.value.trim().toLowerCase();
            const correct = exercise.correct.toLowerCase();
            const alternatives = exercise.alternatives?.map(alt => alt.toLowerCase()) || [];

            const isCorrect = answer === correct || alternatives.includes(answer);
            this.handleAnswer(isCorrect, exercise, answer);
        };

        inputContainer.appendChild(input);
        inputContainer.appendChild(submitButton);
        container.appendChild(inputContainer);
    }

    // Ejercicio de emparejamiento
    renderMatching(exercise, container) {
        const matchingContainer = document.createElement('div');
        matchingContainer.className = 'matching-container';

        const leftColumn = document.createElement('div');
        leftColumn.className = 'matching-column';
        leftColumn.innerHTML = '<h4>Presente</h4>';

        const rightColumn = document.createElement('div');
        rightColumn.className = 'matching-column';
        rightColumn.innerHTML = '<h4>Pasado</h4>';

        // Preparar arrays con índice original y barajar independientemente
        const leftItems = exercise.pairs.map((pair, index) => ({
            text: pair.present,
            pairIndex: index,
            present: pair.present
        }));
        const rightItems = exercise.pairs.map((pair, index) => ({
            text: pair.past,
            pairIndex: index,
            past: pair.past
        }));

        const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);
        shuffle(leftItems);
        shuffle(rightItems);

        leftItems.forEach(item => {
            const presentItem = document.createElement('div');
            presentItem.className = 'matching-item present-item';
            presentItem.textContent = item.text;
            presentItem.dataset.present = item.present;
            presentItem.dataset.pairIndex = item.pairIndex;
            presentItem.onclick = () => this.selectMatchingItem(presentItem, 'present');
            leftColumn.appendChild(presentItem);
        });

        rightItems.forEach(item => {
            const pastItem = document.createElement('div');
            pastItem.className = 'matching-item past-item';
            pastItem.textContent = item.text;
            pastItem.dataset.past = item.past;
            pastItem.dataset.pairIndex = item.pairIndex;
            pastItem.onclick = () => this.selectMatchingItem(pastItem, 'past');
            rightColumn.appendChild(pastItem);
        });

        matchingContainer.appendChild(leftColumn);
        matchingContainer.appendChild(rightColumn);
        container.appendChild(matchingContainer);

        // Inicializar estado de selección
        this.matchingState = {
            selectedPresent: null,
            selectedPast: null,
            pairs: exercise.pairs,
            matchedPairs: []
        };
    }

    // Ejercicio de construcción de oraciones
    renderSentenceConstruction(exercise, container) {
        let original = exercise.question;
        // Tomar texto entre ''
        const match = original.match(/'(.*?)'/);
        if (match) {
            original = match[1];
        }
        const words = original.split(' / ');
        const wordsContainer = document.createElement('div');
        wordsContainer.className = 'words-container';

        const sentenceContainer = document.createElement('div');
        sentenceContainer.className = 'sentence-container';

        // Mezclar palabras
        const shuffledWords = [...words].sort(() => Math.random() - 0.5);

        shuffledWords.forEach(word => {
            const wordButton = document.createElement('button');
            wordButton.className = 'word-button';
            wordButton.textContent = word;
            wordButton.onclick = () => {
                if (wordButton.parentElement === wordsContainer) {
                    sentenceContainer.appendChild(wordButton);
                } else {
                    wordsContainer.appendChild(wordButton);
                }
                this.checkSentenceConstruction(sentenceContainer, exercise);
            };
            wordsContainer.appendChild(wordButton);
        });

        const submitButton = document.createElement('button');
        submitButton.className = 'action-button';
        submitButton.textContent = 'Verificar';
        submitButton.onclick = () => {
            const sentence = Array.from(sentenceContainer.children)
                .map(btn => btn.textContent)
                .join(' ');
            this.handleAnswer(sentence === exercise.correct, exercise, sentence);
        };

        container.appendChild(wordsContainer);
        container.appendChild(sentenceContainer);
        container.appendChild(submitButton);
    }

    // Ejercicio de listening
    renderListening(exercise, container, mediaContainer) {
        const audio = document.createElement('audio');
        audio.src = exercise.audio;
        audio.controls = true;
        audio.className = 'question-audio';
        mediaContainer.appendChild(audio);

        exercise.options.forEach((option, _index) => {
            const button = document.createElement('button');
            button.className = 'option-button';
            button.textContent = option;
            button.onclick = () => this.handleAnswer(option === exercise.correct, exercise);
            container.appendChild(button);
        });
    }

    // Ejercicio de diálogo
    renderDialogue(exercise, container) {
        const inputContainer = document.createElement('div');
        inputContainer.className = 'dialogue-container';

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'dialogue-input';
        input.placeholder = 'Completa la respuesta...';

        const submitButton = document.createElement('button');
        submitButton.className = 'action-button';
        submitButton.textContent = 'Verificar';
        submitButton.onclick = () => {
            const answer = input.value.trim().toLowerCase();
            const correct = exercise.correct.toLowerCase();
            this.handleAnswer(answer === correct, exercise, answer);
        };

        inputContainer.appendChild(input);
        inputContainer.appendChild(submitButton);
        container.appendChild(inputContainer);
    }

    // Ejercicio mixto
    renderMixedExercise(exercise, container) {
        exercise.options.forEach((option, _index) => {
            const button = document.createElement('button');
            button.className = 'option-button';
            button.textContent = option;
            button.onclick = () => this.handleAnswer(option === exercise.correct, exercise);
            container.appendChild(button);
        });
    }

    // Verificar construcción de oración
    checkSentenceConstruction(sentenceContainer, exercise) {
        const words = Array.from(sentenceContainer.children).map(btn => btn.textContent);
        const sentence = words.join(' ');

        if (sentence === exercise.correct) {
            this.handleAnswer(true, exercise, sentence);
        }
    }

    // Seleccionar elemento en matching
    selectMatchingItem(item, type) {
        if (!this.matchingState) return;

        // Deseleccionar elementos previamente seleccionados
        document.querySelectorAll('.matching-item.selected').forEach(el => {
            el.classList.remove('selected');
        });

        // Seleccionar elemento actual
        item.classList.add('selected');

        if (type === 'present') {
            this.matchingState.selectedPresent = item;
        } else {
            this.matchingState.selectedPast = item;
        }

        // Verificar si hay una selección completa
        if (this.matchingState.selectedPresent && this.matchingState.selectedPast) {
            this.checkMatchingPair();
        }
    }

    // Verificar par de matching
    checkMatchingPair() {
        const present = this.matchingState.selectedPresent;
        const past = this.matchingState.selectedPast;

        // Verificar si es el par correcto
        const presentIndex = parseInt(present.dataset.pairIndex);
        const pastIndex = parseInt(past.dataset.pairIndex);

        if (presentIndex === pastIndex) {
            // Par correcto
            present.style.background = '#3B82F6';
            present.style.color = 'white';
            past.style.background = '#3B82F6';
            past.style.color = 'white';

            // Agregar a pares emparejados
            this.matchingState.matchedPairs.push({
                present: present.dataset.present,
                past: past.dataset.past
            });

            // Deshabilitar elementos emparejados
            present.onclick = null;
            past.onclick = null;
            present.style.cursor = 'default';
            past.style.cursor = 'default';

            // Verificar si todos los pares están emparejados
            if (this.matchingState.matchedPairs.length === this.matchingState.pairs.length) {
                this.handleAnswer(true, {correct: 'All matched', explanation: '¡Todos los pares están correctos!'});
            }
        } else {
            // Par incorrecto
            present.style.background = '#ff6b6b';
            past.style.background = '#ff6b6b';

            setTimeout(() => {
                present.style.background = '#f7f9fc';
                past.style.background = '#f7f9fc';
                present.classList.remove('selected');
                past.classList.remove('selected');
            }, 1000);
        }

        // Limpiar selección
        this.matchingState.selectedPresent = null;
        this.matchingState.selectedPast = null;
    }


    // Manejar respuesta
    handleAnswer(isCorrect, exercise, _userAnswer = '') {
        const buttons = document.querySelectorAll('.option-button, .action-button, .word-button, .challenge-option-button, .review-option-button');
        buttons.forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.6';
        });

        if (isCorrect) {
            this.score++;
            this.showFeedback("¡Correcto! 🎉", "correct");
            if (window.duolingoApp) {
                window.duolingoApp.addXP(2);
            }
        } else {
            this.heartsLost++;
            this.showFeedback(`Incorrecto. La respuesta correcta es: ${exercise.correct}`, "incorrect");
            if (window.duolingoApp) {
                window.duolingoApp.loseHeart();
            }
        }

        // Mostrar explicación
        this.showExplanation(exercise.explanation);

        // Si una página externa (desafío/repaso) gestiona el flujo, avisarle y no avanzar internamente
        if (typeof this.onAnswer === 'function') {
            try { this.onAnswer(isCorrect, exercise); } catch (e) { console.error('onAnswer callback error:', e); }
        } else {
            // Continuar después de un delay más corto para respuestas correctas (flujo de niveles)
            const delay = isCorrect ? 2000 : 3000;
            setTimeout(() => {
                this.nextExercise();
            }, delay);
        }
    }

    // Mostrar feedback
    showFeedback(message, type) {
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
            z-index: 10000;
            animation: feedbackShow 2s ease-out forwards;
        `;

        document.body.appendChild(feedback);
        setTimeout(() => feedback.remove(), 2000);
    }

    // Mostrar explicación
    showExplanation(explanation) {
        const explanationDiv = document.createElement('div');
        explanationDiv.className = 'explanation';
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

        document.getElementById('options-container').appendChild(explanationDiv);
    }

    // Siguiente ejercicio
    nextExercise() {
        this.currentExerciseIndex++;
        this.renderCurrentExercise();
    }

    // Actualizar progreso
    updateProgress() {
        const progressBar = document.getElementById('quiz-progress');
        if (progressBar) {
            const progress = ((this.currentExerciseIndex + 1) / this.config.exercises.length) * 100;
            progressBar.style.width = `${progress}%`;
        }
    }

    // Completar nivel
    completeLevel() {
        const timeSpent = Math.round((Date.now() - this.startTime) / 1000);
        const accuracy = (this.score / this.config.exercises.length) * 100;
        // Ajuste: evitar duplicar XP ya ganado por aciertos (2 XP por respuesta correcta)
        const perAnswerXp = 2;
        const earnedDuringLevel = this.score * perAnswerXp;
        const baseRemaining = Math.max(0, this.config.xpReward - earnedDuringLevel);
        const xpGained = baseRemaining + (accuracy === 100 ? 5 : 0);

        // Verificar si cumple con el puntaje mínimo requerido (70% de precisión)
        const minRequiredScore = Math.ceil(this.config.exercises.length * 0.7);
        const levelPassed = this.score >= minRequiredScore;

        if (levelPassed) {
            document.getElementById('question-container').innerHTML = `
                <div class="result-title">🎉 ¡Nivel completado!</div>
            `;

            document.getElementById('options-container').innerHTML = `
                <div class="result-container">
                    <div class="result-score">Puntuación: ${this.score} / ${this.config.exercises.length}</div>
                    <div class="result-score">Precisión: ${Math.round(accuracy)}%</div>
                    <div class="result-score">Tiempo: ${timeSpent} segundos</div>
                    <div class="xp-gained">+${xpGained} XP ganados</div>
                    <div class="level-status success">✅ Nivel aprobado</div>
                    <p>Redirigiendo a la página principal en <span id="contador">5</span> segundos...</p>
                    <a href="inicio.html" class="action-button">Volver ahora</a>
                </div>
            `;

            // Agregar XP y completar lección solo si pasó el nivel
            if (window.duolingoApp) {
                window.duolingoApp.addXP(xpGained);
                completeLesson(this.levelNumber);
            }
        } else {
            document.getElementById('question-container').innerHTML = `
                <div class="result-title">❌ Nivel no aprobado</div>
            `;

            document.getElementById('options-container').innerHTML = `
                <div class="result-container">
                    <div class="result-score">Puntuación: ${this.score} / ${this.config.exercises.length}</div>
                    <div class="result-score">Precisión: ${Math.round(accuracy)}%</div>
                    <div class="result-score">Tiempo: ${timeSpent} segundos</div>
                    <div class="level-status failed">❌ Necesitas al menos ${minRequiredScore} respuestas correctas (70%)</div>
                    <div class="retry-options">
                        <button onclick="location.reload()" class="action-button retry-button">Reintentar nivel</button>
                        <a href="inicio.html" class="action-button secondary-button">Volver al inicio</a>
                    </div>
                </div>
            `;
        }

        // Contador de redirección solo si pasó el nivel
        if (levelPassed) {
            let segundos = 5;
            const intervalo = setInterval(() => {
                segundos--;
                const contador = document.getElementById("contador");
                if (contador) {
                    contador.textContent = segundos;
                }
                if (segundos <= 0) {
                    clearInterval(intervalo);
                    window.location.href = "inicio.html";
                }
            }, 1000);
        }
    }
}
