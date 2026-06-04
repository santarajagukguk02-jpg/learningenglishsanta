       let currentUser = "";

        // --- NAVIGATION & AUTH ---
        function handleLogin() {
            const name = document.getElementById('student-name').value.trim();
            const pass = document.getElementById('student-pass').value.trim();
            const err = document.getElementById('login-error');

            if (name === "" || pass === "") {
                err.innerText = "Please enter both name and password.";
                return;
            }
            if (pass.length < 4) {
                err.innerText = "Password must be at least 4 characters long.";
                return;
            }

            currentUser = name;
            err.innerText = "";
            document.getElementById('welcome-message').innerText = `Welcome, ${currentUser}`;
            
            document.getElementById('login-section').classList.add('hidden');
            document.getElementById('dashboard-section').classList.remove('hidden');
        }

        function logout() {
            document.getElementById('student-name').value = "";
            document.getElementById('student-pass').value = "";
            currentUser = "";
            showSection('login-section');
        }

        function showDashboard() {
            showSection('dashboard-section');
        }

        function showSection(sectionId) {
            const sections = ['login-section', 'dashboard-section', 'vocab-section', 'grammar-section', 'spelling-section'];
            sections.forEach(id => document.getElementById(id).classList.add('hidden'));
            document.getElementById(sectionId).classList.remove('hidden');
        }

        function openGame(gameType) {
            if (gameType === 'vocab') initVocabGame();
            if (gameType === 'grammar') initGrammarGame();
            if (gameType === 'spelling') initSpellingGame();
        }

        // --- GAME 1: VOCABULARY MATCHER ---
        const vocabData = [
            { word: "Enormous", def: "Very large in size or quantity." },
            { word: "Fascinating", def: "Extremely interesting." },
            { word: "Delicious", def: "Having a very pleasant taste or smell." },
            { word: "Exhausted", def: "Very tired." },
            { word: "Excited", def: "Very happy." }

            
        ];
        
        let vocabSelected = null;
        let vocabSolvedCount = 0;

        function initVocabGame() {
            showSection('vocab-section');
            vocabSolvedCount = 0;
            vocabSelected = null;
            document.getElementById('vocab-feedback').innerText = "";
            
            const grid = document.getElementById('vocab-grid');
            grid.innerHTML = "";

            // Create arrays for words and definitions, then shuffle them
            let items = [];
            vocabData.forEach(item => {
                items.push({ text: item.word, type: 'word', match: item.word });
                items.push({ text: item.def, type: 'def', match: item.word });
            });
            items.sort(() => Math.random() - 0.5); // Shuffle

            items.forEach(item => {
                const div = document.createElement('div');
                div.className = 'match-card';
                div.innerText = item.text;
                div.dataset.type = item.type;
                div.dataset.match = item.match;
                div.onclick = () => handleVocabClick(div);
                grid.appendChild(div);
            });
        }

        function handleVocabClick(element) {
            if (element.classList.contains('solved')) return;

            if (!vocabSelected) {
                // First click
                vocabSelected = element;
                element.classList.add('selected');
            } else {
                // Second click
                if (vocabSelected === element) {
                    // Deselect if clicked same item
                    element.classList.remove('selected');
                    vocabSelected = null;
                    return;
                }

                const type1 = vocabSelected.dataset.type;
                const type2 = element.dataset.type;

                if (type1 === type2) {
                    // Clicked two words or two defs. Change selection.
                    vocabSelected.classList.remove('selected');
                    vocabSelected = element;
                    element.classList.add('selected');
                    return;
                }

                // Check for match
                if (vocabSelected.dataset.match === element.dataset.match) {
                    // Correct Match
                    vocabSelected.classList.remove('selected');
                    vocabSelected.classList.add('solved');
                    element.classList.add('solved');
                    vocabSolvedCount++;
                    document.getElementById('vocab-feedback').innerHTML = `<span class="text-success">Excellent match!</span>`;
                    
                    if (vocabSolvedCount === vocabData.length) {
                        document.getElementById('vocab-feedback').innerHTML = `<span class="text-success">Brilliant! You matched them all! 🎉</span>`;
                    }
                } else {
                    // Wrong Match
                    vocabSelected.classList.remove('selected');
                    document.getElementById('vocab-feedback').innerHTML = `<span class="text-error">Incorrect. Try again!</span>`;
                }
                vocabSelected = null;
            }
        }

        // --- GAME 2: GRAMMAR QUIZ ---
        const grammarData = [
            { q: "Yesterday, I ___ to the museum with my friends.", opts: ["go", "went", "going"], ans: "went" },
            { q: "She ___ reading a book when the phone rang.", opts: ["is", "were", "was"], ans: "was" },
            { q: "If it rains tomorrow, we ___ at home.", opts: ["will stay", "stayed", "staying"], ans: "will stay" },
            { q: "The list of items __ on the table.", opts: ["are", "is", "have", "were"],  ans: "is"},
            { q: "The dogs in the backyard ____ loudly every night.", opts: ["bark", "barks", "barking", "is barking"], ans: "bark"}
        ];
        let grammarIndex = 0;

        function initGrammarGame() {
            showSection('grammar-section');
            grammarIndex = 0;
            loadGrammarQuestion();
        }

        function loadGrammarQuestion() {
            if (grammarIndex >= grammarData.length) {
                document.getElementById('grammar-q').innerText = "Module Complete! Well done.";
                document.getElementById('grammar-opts').innerHTML = "";
                document.getElementById('grammar-feedback').innerText = "";
                document.getElementById('grammar-next').classList.add('hidden');
                return;
            }

            const data = grammarData[grammarIndex];
            document.getElementById('grammar-q').innerText = data.q;
            document.getElementById('grammar-feedback').innerText = "";
            document.getElementById('grammar-next').classList.add('hidden');
            
            const optsContainer = document.getElementById('grammar-opts');
            optsContainer.innerHTML = "";

            data.opts.forEach(opt => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.innerText = opt;
                btn.onclick = () => checkGrammar(opt, data.ans, btn);
                optsContainer.appendChild(btn);
            });
        }

        function checkGrammar(selected, correct, btn) {
            // Disable all buttons after choice
            const buttons = document.querySelectorAll('.option-btn');
            buttons.forEach(b => b.style.pointerEvents = 'none');

            const feedback = document.getElementById('grammar-feedback');
            if (selected === correct) {
                btn.style.backgroundColor = 'var(--success-green)';
                btn.style.color = 'white';
                btn.style.borderColor = 'var(--success-green)';
                feedback.innerHTML = `<span class="text-success">Correct! Great job.</span>`;
            } else {
                btn.style.backgroundColor = 'var(--error-red)';
                btn.style.color = 'white';
                btn.style.borderColor = 'var(--error-red)';
                feedback.innerHTML = `<span class="text-error">Incorrect. The correct answer was '${correct}'.</span>`;
            }
            document.getElementById('grammar-next').classList.remove('hidden');
        }

        function nextGrammar() {
            grammarIndex++;
            loadGrammarQuestion();
        }

        // --- GAME 3: SPELLING BEE ---
        const spellingData = [
            { word: "ELEPHANT", clue: "A very large gray animal with a long trunk." },
            { word: "LIBRARY", clue: "A place where you can borrow books." },
            { word: "UMBRELLA", clue: "Used to protect yourself from the rain." },
            { word: "SCHOOL", clue: "A place ti study." },
            { word: "PEN", clue: "Items for writing in books." }
        ];
        let spellingIndex = 0;
        let currentWordChars = [];

        function initSpellingGame() {
            showSection('spelling-section');
            spellingIndex = 0;
            loadSpellingWord();
        }

        function loadSpellingWord() {
            if (spellingIndex >= spellingData.length) {
                document.getElementById('spell-clue').innerText = "Module Complete! Fantastic spelling.";
                document.getElementById('spell-answer').innerHTML = "";
                document.getElementById('spell-pool').innerHTML = "";
                document.getElementById('spell-feedback').innerText = "";
                document.getElementById('spell-next').classList.add('hidden');
                return;
            }

            const data = spellingData[spellingIndex];
            document.getElementById('spell-clue').innerText = `Clue: ${data.clue}`;
            document.getElementById('spell-feedback').innerText = "";
            document.getElementById('spell-next').classList.add('hidden');
            
            const answerBox = document.getElementById('spell-answer');
            const poolBox = document.getElementById('spell-pool');
            answerBox.innerHTML = "";
            poolBox.innerHTML = "";

            currentWordChars = data.word.split('');
            let shuffledChars = [...currentWordChars].sort(() => Math.random() - 0.5);

            shuffledChars.forEach((char, index) => {
                const tile = document.createElement('div');
                tile.className = 'tile';
                tile.innerText = char;
                tile.id = `tile-${index}`;
                tile.onclick = () => moveTile(tile);
                poolBox.appendChild(tile);
            });
        }

        function moveTile(tile) {
            const answerBox = document.getElementById('spell-answer');
            const poolBox = document.getElementById('spell-pool');
            
            if (tile.parentElement.id === 'spell-pool') {
                answerBox.appendChild(tile);
            } else {
                poolBox.appendChild(tile);
            }

            checkSpelling();
        }

        function checkSpelling() {
            const answerBox = document.getElementById('spell-answer');
            const poolBox = document.getElementById('spell-pool');
            
            // Only check if all tiles are in the answer box
            if (poolBox.children.length === 0) {
                let userSpelling = "";
                for (let i = 0; i < answerBox.children.length; i++) {
                    userSpelling += answerBox.children[i].innerText;
                }

                const correctWord = spellingData[spellingIndex].word;
                if (userSpelling === correctWord) {
                    document.getElementById('spell-feedback').innerHTML = `<span class="text-success">Perfect spelling!</span>`;
                    document.getElementById('spell-next').classList.remove('hidden');
                    // Disable clicking after correct
                    for (let i = 0; i < answerBox.children.length; i++) {
                        answerBox.children[i].style.pointerEvents = 'none';
                        answerBox.children[i].style.backgroundColor = 'var(--success-green)';
                        answerBox.children[i].style.boxShadow = 'none';
                    }
                } else {
                    document.getElementById('spell-feedback').innerHTML = `<span class="text-error">Not quite right. Click letters to move them back and try again.</span>`;
                }
            } else {
                // Clear feedback if they move a tile back
                document.getElementById('spell-feedback').innerText = "";
            }

        }

        function nextSpelling() {
            spellingIndex++;
            loadSpellingWord();
        }