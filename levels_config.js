// Configuración dinámica de niveles - Estilo Duolingo
const LEVELS_CONFIG = {
    1: {
        title: "Verbos Regulares",
        subtitle: "Past Simple",
        difficulty: "Principiante",
        color: "#58cc02",
        icon: "img/Iglu.webp",
        character: "🎓",
        background: "linear-gradient(135deg, #3B82F6, #3B82F6)",
        xpReward: 10,
        heartsRequired: 0,
        exercises: [
            {
                type: "multiple_choice",
                question: "What is the past of 'play'?",
                options: ["Play", "Played", "Playing", "Plays"],
                correct: "Played",
                explanation: "Los verbos regulares terminan en '-ed' en pasado simple."
            },
            {
                type: "multiple_choice",
                question: "What is the past of 'work'?",
                options: ["Worked", "Working", "Works", "Work"],
                correct: "Worked",
                explanation: "Work + ed = Worked"
            },
            {
                type: "fill_blank",
                question: "Complete: Yesterday I _____ (walk) to school.",
                correct: "walked",
                explanation: "Walk + ed = Walked"
            },
            {
                type: "translation",
                question: "Translate to English: 'Ayer cociné pasta'",
                correct: "Yesterday I cooked pasta",
                alternatives: ["I cooked pasta Yesterday"],
                explanation: "Cocinar = cook, pasado = cooked"
            },
            {
                type: "multiple_choice",
                question: "What is the past of 'study'?",
                options: ["Studyed", "Studied", "Study", "Studying"],
                correct: "Studied",
                explanation: "Study + ied = Studied (cuando termina en consonante + y)"
            },
            {
                type: "fill_blank",
                question: "Complete: She _____ (cook) dinner last night.",
                correct: "cooked",
                explanation: "Cook + ed = Cooked"
            },
            {
                type: "translation",
                question: "Translate to English: 'La semana pasada estudié matemáticas'",
                correct: "The last week I studied mathematics",
                alternatives: ["I studied mathematics the last week "],
                explanation: "Estudiar = study, pasado = studied"
            },
            {
                type: "sentence_construction",
                question: "Arrange the words: 'played / yesterday / I / football'",
                correct: "I played football yesterday",
                explanation: "Orden: Sujeto + verbo en pasado + complemento + tiempo"
            }
        ]
    },
    2: {
        title: "Verbos Irregulares",
        subtitle: "Past Simple",
        difficulty: "Intermedio",
        color: "#ff6b6b",
        icon: "img/Iglu.webp",
        character: "🔥",
        background: "linear-gradient(135deg, #3B82F6, #3B82F6)",
        xpReward: 15,
        heartsRequired: 0,
        exercises: [
            {
                type: "multiple_choice",
                question: "What is the past of 'go'?",
                options: ["Goed", "Went", "Gone", "Going"],
                correct: "Went",
                explanation: "Go es irregular: go → went → gone"
            },
            {
                type: "multiple_choice",
                question: "What is the past of 'see'?",
                options: ["Seed", "Saw", "Seen", "Seeing"],
                correct: "Saw",
                explanation: "See es irregular: see → saw → seen"
            },
            {
                type: "fill_blank",
                question: "Complete: Last night I _____ (eat) pizza.",
                correct: "ate",
                explanation: "Eat es irregular: eat → ate → eaten"
            },
            {
                type: "translation",
                question: "Translate to English: 'Ayer fui al cine'",
                correct: "Yesterday I went to the cinema",
                alternatives: ["I went to the cinema yesterday"],
                explanation: "Ir = go, pasado = went"
            },
            {
                type: "matching",
                question: "Match the verbs with their past forms:",
                pairs: [
                    {present: "run", past: "ran"},
                    {present: "swim", past: "swam"},
                    {present: "write", past: "wrote"},
                    {present: "go", past: "went"},
                    {present: "buy", past: "bought"},
                    {present: "see", past: "saw"},
                    {present: "eat", past: "ate"},
                    {present: "drink", past: "drank"}
                ],
                explanation: "Estos son verbos irregulares comunes"
            },
            {
                type: "multiple_choice",
                question: "What is the past of 'drink'?",
                options: ["Drinked", "Drank", "Drunk", "Drinking"],
                correct: "Drank",
                explanation: "Drink es irregular: drink → drank → drunk"
            },
            {
                type: "fill_blank",
                question: "Complete: Last week I _____ (buy) a new car.",
                correct: "bought",
                explanation: "Buy es irregular: buy → bought → bought"
            },
            {
                type: "translation",
                question: "Translate to English: 'Leí un libro el mes pasado'",
                correct: "The last month I read a book",
                alternatives: ["I read a book the last month"],
                explanation: "Leer = read, pasado = read"
            }
        ]
    },
    3: {
        title: "Presente Continuo",
        subtitle: "Present Continuous",
        difficulty: "Intermedio",
        color: "#4ecdc4",
        icon: "img/Iglu.webp",
        character: "⚡",
        background: "linear-gradient(135deg, #3B82F6, #3B82F6)",
        xpReward: 20,
        heartsRequired: 0,
        exercises: [
            {
                type: "multiple_choice",
                question: "What is the correct form? 'I _____ (read) a book now.'",
                options: ["am reading", "am read", "reading", "read"],
                correct: "am reading",
                explanation: "Presente continuo: am/is/are + verbo + ing"
            },
            {
                type: "fill_blank",
                question: "Complete: She _____ (study) English right now.",
                correct: "is studying",
                alternatives: ["'s studying"],
                explanation: "She + is + studying"
            },
            {
                type: "translation",
                question: "Translate to English: 'Estoy cocinando ahora'",
                correct: "I am cooking now",
                alternatives: ["I'm cooking now"],
                explanation: "Estar + gerundio = am/is/are + ing"
            },
            {
                type: "sentence_construction",
                question: "Arrange the words: 'playing / are / They / football'",
                correct: "They are playing football",
                explanation: "Orden: Sujeto + am/is/are + verbo + ing + complemento"
            },
            {
                type: "listening",
                question: "Listen and choose the correct answer:",
                audio: "audios/presente_continuo.opus",
                options: ["I am working", "I work", "I worked"],
                correct: "I am working",
                explanation: "Presente continuo indica acción en progreso"
            },
            {
                type: "multiple_choice",
                question: "What is the correct form? 'They _____ (play) soccer now.'",
                options: ["are playing", "are play", "playing", "play"],
                correct: "are playing",
                explanation: "Presente continuo: are + playing"
            },
            {
                type: "fill_blank",
                question: "Complete: We _____ (watch) TV at the moment.",
                correct: "are watching",
                alternatives: ["'re playing'"],
                explanation: "We + are + watching"
            },
            {
                type: "translation",
                question: "Translate to English: 'Están estudiando inglés'",
                correct: "They are studying English",
                alternatives: ["They're studying English"],
                explanation: "Estar + gerundio = are + studying"
            }
        ]
    },
    4: {
        title: "Futuro Simple",
        subtitle: "Future Simple",
        difficulty: "Avanzado",
        color: "#a8e6cf",
        icon: "img/Iglu.webp",
        character: "🚀",
        background: "linear-gradient(135deg, #3B82F6, #3B82F6)",
        xpReward: 25,
        heartsRequired: 0,
        exercises: [
            {
                type: "multiple_choice",
                question: "What is the correct future form? 'I _____ (travel) to Paris tomorrow.'",
                options: ["will travel", "am traveling", "travel", "traveled"],
                correct: "will travel",
                explanation: "Futuro simple: will + verbo base"
            },
            {
                type: "fill_blank",
                question: "Complete: They _____ (visit) us next week.",
                correct: "will visit",
                alternatives: ["'ll visit"],
                explanation: "Will + visit (verbo base)"
            },
            {
                type: "translation",
                question: "Translate to English: 'Mañana estudiaré matemáticas'",
                correct: "Tomorrow I will study mathematics",
                alternatives: ["I'll study mathematics tomorrow", "I will study mathematics tomorrow", "Tomorrow I'll study mathematics"],
                explanation: "Futuro simple: will + verbo base"
            },
            {
                type: "sentence_construction",
                question: "Arrange the words: 'will / tomorrow / rain / It'",
                correct: "It will rain tomorrow",
                explanation: "Orden: Sujeto + will + verbo + complemento"
            },
            {
                type: "listening",
                question: "Listen and choose the correct answer:",
                audio: "audios/future_simple.opus",
                options: ["I will help you", "I help you", "I am helping you"],
                correct: "I will help you",
                explanation: "Will indica futuro"
            },
            {
                type: "dialogue",
                question: "Complete the conversation: A: 'What are your plans?' B: 'I _____ (go) to the beach.'",
                correct: "will go",
                explanation: "Respuesta sobre planes futuros"
            },
            {
                type: "multiple_choice",
                question: "What is the correct future form? 'She _____ (visit) her grandmother tomorrow.'",
                options: ["will visit", "is visiting", "visits", "visited"],
                correct: "will visit",
                explanation: "Futuro simple: will + verbo base"
            },
            {
                type: "fill_blank",
                question: "Complete: I _____ (call) you later tonight.",
                correct: "will call",
                alternatives: ["'ll call"],
                explanation: "Will + call (verbo base)"
            },
            {
                type: "translation",
                question: "Translate to English: 'Mañana viajaré a Madrid'",
                correct: "Tomorrow I will travel to Madrid",
                alternatives: ["Tomorrow I'll travel to Madrid", "I'll travel to Madrid tomorrow", "I will travel to Madrid tomorrow"],
                explanation: "Futuro simple: will + verbo base"
            },
            {
                type: "sentence_construction",
                question: "Arrange: 'will / next / year / graduate / I'",
                correct: "I will graduate next year",
                explanation: "Orden: Sujeto + will + verbo + complemento"
            }
        ]
    },
    5: {
        title: "Condicionales",
        subtitle: "Conditionals",
        difficulty: "Experto",
        color: "#ffd93d",
        icon: "img/Iglu.webp",
        character: "👑",
        background: "linear-gradient(135deg, #3B82F6, #3B82F6)",
        xpReward: 30,
        heartsRequired: 0,
        exercises: [
            {
                type: "multiple_choice",
                question: "Complete: 'If I _____ (have) time, I will call you.'",
                options: ["have", "had", "will have", "would have"],
                correct: "have",
                explanation: "Primera condicional: If + presente simple, will + verbo base"
            },
            {
                type: "fill_blank",
                question: "Complete: 'If I _____ (be) rich, I would buy a house.'",
                correct: "were",
                explanation: "Segunda condicional: If + pasado simple, would + verbo base"
            },
            {
                type: "translation",
                question: "Translate to English: 'Si estudio, aprobaré el examen'",
                correct: "If I study, I will pass the exam",
                alternatives: ["If I studied, I would pass the exam"],
                explanation: "Primera condicional para situaciones reales"
            },
            {
                type: "sentence_construction",
                question: "Arrange: 'would / if / I / you / help / I / could'",
                correct: "I would help you if I could",
                explanation: "Segunda condicional: would + verbo base + if + pasado simple"
            },
            {
                type: "listening",
                question: "Listen and choose the correct answer:",
                audio: "audios/condicional.opus",
                options: ["If it rains, I will stay home", "If it rained, I would stay home"],
                correct: "If it rains, I will stay home",
                explanation: "Primera condicional para situaciones probables"
            },
            {
                type: "dialogue",
                question: "Complete: A: 'What would you do if you won the lottery?' B: 'I _____ (travel) around the world.'",
                correct: "would travel",
                explanation: "Segunda condicional para situaciones hipotéticas"
            },
            {
                type: "mixed_exercise",
                question: "Choose the correct conditional: 'If I _____ (know) the answer, I _____ (tell) you.'",
                options: [
                    "know, will tell",
                    "knew, would tell",
                    "had known, would have told"
                ],
                correct: "knew, would tell",
                explanation: "Segunda condicional para situaciones hipotéticas"
            },
            {
                type: "multiple_choice",
                question: "Complete: 'If it _____ (rain), we will stay home.'",
                options: ["rains", "rained", "will rain", "would rain"],
                correct: "rains",
                explanation: "Primera condicional: If + presente simple, will + verbo base"
            },
            {
                type: "fill_blank",
                question: "Complete: 'If I _____ (have) more time, I would learn French.'",
                correct: "had",
                explanation: "Segunda condicional: If + pasado simple, would + verbo base"
            },
            {
                type: "translation",
                question: "Translate to English: 'Si estudio mucho, aprobaré el examen'",
                correct: "If I study hard, I will pass the exam",
                alternatives: ["If I studied hard, I would pass the exam"],
                explanation: "Primera condicional para situaciones reales"
            },
            {
                type: "sentence_construction",
                question: "Arrange: 'buy / had / I / money / more / If / would / a car / I'",
                correct: "If I had more money, I would buy a car",
                explanation: "Segunda condicional: If + pasado simple, would + verbo base"
            }
        ]
    }
};

// Función para obtener la configuración de un nivel
function getLevelConfig(levelNumber) {
    return LEVELS_CONFIG[levelNumber] || null;
}

// Función para verificar si un nivel está desbloqueado
function isLevelUnlocked(levelNumber) {
    if (levelNumber === 1) return true;

    // Verificar múltiples fuentes de datos para compatibilidad
    const completedLessons = JSON.parse(localStorage.getItem('completedLessons')) || [];
    const legacyFlags = [];
    for (let i = 1; i <= 5; i++) {
        if (localStorage.getItem(`nivel${i}_completado`) === 'true') {
            legacyFlags.push(i);
        }
    }

    // Combinar ambas fuentes
    const allCompletedLessons = Array.from(new Set([...completedLessons, ...legacyFlags]));

    const requiredHearts = LEVELS_CONFIG[levelNumber]?.heartsRequired || 0;
    const currentHearts = parseInt(localStorage.getItem('hearts')) || 5;

    // Verificar que el nivel anterior esté completado y tenga suficientes corazones
    const previousLevelCompleted = allCompletedLessons.includes(levelNumber - 1);
    const hasEnoughHearts = currentHearts >= requiredHearts;

    return previousLevelCompleted && hasEnoughHearts;
}