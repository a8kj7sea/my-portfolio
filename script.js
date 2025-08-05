import { createApp, ref, reactive, nextTick, onMounted, computed } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

createApp({
  setup() {
    // --- STATE ---
    const isTerminalOpen = ref(false);
    const commandInput = ref("");
    const commandHistory = ref([]);
    const activeSections = reactive({});
    const terminalWidth = ref(500);

    // --- NEW: Command History Navigation State ---
    const typedCommandHistory = ref([]);
    const historyNavigatorIndex = ref(null);
    let draftCommand = '';

    // --- REFS ---
    const terminalRef = ref(null);
    const terminalOutput = ref(null);
    const commandInputRef = ref(null);

    // --- MATRIX BACKGROUND LOGIC ---
    const setupMatrix = () => {
      const canvas = document.getElementById('matrix-background');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      let columns, drops;

      const setCanvasDimensions = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        columns = canvas.width / 16;
        drops = Array(Math.floor(columns)).fill(1);
      };
      setCanvasDimensions();

      const matrix = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%";

      function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--dim-accent').trim();
        ctx.font = `16px monospace`;

        for (let i = 0; i < drops.length; i++) {
          const text = matrix[Math.floor(Math.random() * matrix.length)];
          ctx.fillText(text, i * 16, drops[i] * 16);
          if (drops[i] * 16 > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      }
      const intervalId = setInterval(draw, 50);
      window.addEventListener('resize', setCanvasDimensions);
    };

    onMounted(setupMatrix);

    // --- RESIZING LOGIC ---
    const isResizing = ref(false);
    const initialWidth = ref(0);
    const initialMouseX = ref(0);
    const startResize = (event) => {
      event.preventDefault();
      isResizing.value = true;
      initialMouseX.value = event.clientX;
      initialWidth.value = terminalRef.value.offsetWidth;
      window.addEventListener('mousemove', handleResize);
      window.addEventListener('mouseup', stopResize);
    };
    const handleResize = (event) => {
      if (isResizing.value) {
        const deltaX = event.clientX - initialMouseX.value;
        terminalWidth.value = initialWidth.value + deltaX;
      }
    };
    const stopResize = () => {
      isResizing.value = false;
      window.removeEventListener('mousemove', handleResize);
      window.removeEventListener('mouseup', stopResize);
    };
    const appStyle = computed(() => ({
      '--terminal-width-val': `${terminalWidth.value}px`
    }));

    // --- THEMES ---
    const themes = {
      matrix: { '--primary-accent': '#00ff41', '--dim-accent': '#008F11', '--shadow-color': 'rgba(0, 255, 65, 0.1)', '--tag-bg': '#008F11', '--link-color': '#00AFFF' },
      ice: { '--primary-accent': '#00d9ff', '--dim-accent': '#008fb3', '--shadow-color': 'rgba(0, 217, 255, 0.15)', '--tag-bg': '#008fb3', '--link-color': '#64ffda' },
      fire: { '--primary-accent': '#ff8a00', '--dim-accent': '#b36200', '--shadow-color': 'rgba(255, 138, 0, 0.15)', '--tag-bg': '#b36200', '--link-color': '#ff4500' },
    };

    // --- CONTENT (with Discord info added) ---
    const sectionsContent = {
      about: { html: `<div class="section"><h2>About Me</h2><p>Aspiring Java Developer with a passion for clean, efficient code and practical software solutions. My focus is on back-end development, API integrations, and creating robust, scalable systems. I am a dedicated open-source contributor, constantly expanding my skills in AI, Machine Learning, and software design.</p><p>Currently, I am deepening my backend knowledge by learning <strong>Spring Framework</strong>, and I have experience with technologies like <strong>Spigot API</strong>, <strong>Bungeecord</strong>, and <strong>Redis</strong>. My goal is to build large, well-structured systems and contribute to impactful projects.</p></div>` },
      skills: { html: `<div class="section"><h2>Skills</h2><div class="skills-grid"><div class="skills-category"><h3>Primary Language</h3><ul><li>Java (OOP, Core, Design Patterns, Clean Code)</li><li>Problem Solving & Algorithmic Thinking</li></ul></div><div class="skills-category"><h3>Backend Development</h3><ul><li>Spigot API, Bungeecord</li><li>Redis, MySQL</li><li>Maven</li><li><span class="learning">Learning:</span> Spring Framework</li></ul></div><div class="skills-category"><h3>Frontend Development</h3><ul><li>HTML, CSS</li><li><span class="learning">Learning:</span> Vue.js</li></ul></div><div class="skills-category"><h3>Tools & Concepts</h3><ul><li>Git & Github</li><li>API Design & Integration</li><li>AI & Machine Learning Concepts</li><li>Robotics & IoT (Arduino, Sensors)</li></ul></div></div></div>` },
      projects: { html: `<div class="section"><h2>Projects</h2><div class="projects-grid"><div class="project-card"><h3>Mattc-Rule-based Tokenizer</h3><p>An advanced lexer (tokenizer) developed for a custom programming language project called Zeta.</p><div class="project-tags"><span class="tag">Java</span><span class="tag">Compiler Design</span><span class="tag">Lexer</span></div><a href="https://github.com/a8kj7sea/Mattc" target="_blank" class="project-link">View on GitHub</a></div><div class="project-card"><h3>a8kJson (JSON Library)</h3><p>A simple, from-scratch JSON parser library built during a trial task for Maqsam.</p><div class="project-tags"><span class="tag">Java</span><span class="tag">JSON</span><span class="tag">Parser</span></div><a href="https://github.com/a8kj7sea/a8kJson" target="_blank" class="project-link">View on GitHub</a></div><div class="project-card"><h3>ReplyBot (Discord Bot)</h3><p>A Discord bot creating a cross-server ticket system, allowing private communication between clients and freelancers.</p><div class="project-tags"><span class="tag">Java</span><span class="tag">Discord API</span><span class="tag">Bots</span></div><a href="https://github.com/a8kj7sea/ReplyBot" target="_blank" class="project-link">View on GitHub</a></div><div class="project-card"><h3>LootboxesAPI (Spigot Plugin)</h3><p>A Spigot API allowing developers to implement custom lootboxes in Minecraft using ArmorStand entities for random prizes.</p><div class="project-tags"><span class="tag">Java</span><span class="tag">Spigot API</span><span class="tag">Minecraft</span></div><a href="https://github.com/a8kj7sea/Lootboxes" target="_blank" class="project-link">View on GitHub</a></div><div class="project-card"><h3>Captcha Library</h3><p>A Java library for generating and utilizing CAPTCHA challenges in applications with customizable characters and noise.</p><div class="project-tags"><span class="tag">Java</span><span class="tag">Security</span><span class="tag">Library</span></div><a href="https://github.com/a8kj7sea/captcha" target="_blank" class="project-link">View on GitHub</a></div><div class="project-card"><h3>CVWizard Scraper</h3><p>A tool that scrapes CV data from CVWizard and converts it into a clean PDF, saving costs for job seekers.</p><div class="project-tags"><span class="tag">Java</span><span class="tag">Web Scraping</span><span class="tag">PDF</span></div><a href="https://github.com/a8kj7sea/CVWizard-Scraper" target="_blank" class="project-link">View on GitHub</a></div></div></div>` },
      education: { html: `<div class="section"><h2>Education</h2><h3>Diploma in AI and Robotics Engineering</h3><p><strong>University:</strong> Al-Balqa Applied University (BAU)<br><strong>GPA:</strong> 91.6 / 100<br><strong>Duration:</strong> Jan 2023 - Present (Expected Graduation: 2026)</p><p>Key coursework includes Artificial Intelligence, Machine Learning, Image Processing, C++, and OOP principles.</p></div>` },
      contact: {
        html: `<div class="section"><h2>Contact & Profiles</h2><ul class="contact-list">
                    <li>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                      <a href="mailto:ibrahim.athamaneh@outlook.com">ibrahim.athamaneh@outlook.com</a>
                    </li>
                    <li>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                      <a href="https://github.com/a8kj7sea" target="_blank">github.com/a8kj7sea</a>
                    </li>
                    <li>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                      <a href="https://linkedin.com/in/ibrax" target="_blank">linkedin.com/in/ibrax</a>
                    </li>
                    <li>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20.32,3.38a1,1,0,0,0-1-.12,12.28,12.28,0,0,0-3.91.8,10.66,10.66,0,0,0-4.7,0,12.28,12.28,0,0,0-3.91-.8,1,1,0,0,0-1,.12,13.43,13.43,0,0,0-3.53,10.43,12.63,12.63,0,0,0,4,8.4,1,1,0,0,0,.69.21,1,1,0,0,0,.21,0,1,1,0,0,0,.69-.26,9,9,0,0,0,1.52-2.3,1,1,0,0,0-.2-1.09,1,1,0,0,0-1.09-.2,6.79,6.79,0,0,1-1.35.43,1,1,0,0,0-1.1.8,10.19,10.19,0,0,1-2.45-4.6,11.23,11.23,0,0,1,3-8.86,1,1,0,0,0,.5-.17A10.22,10.22,0,0,1,12,5.1a10.22,10.22,0,0,1,4.78-1.12,1,1,0,0,0,.5.17,11.23,11.23,0,0,1,3,8.86,10.19,10.19,0,0,1-2.45,4.6,1,1,0,0,0-1.1-.8,6.79,6.79,0,0,1-1.35-.43,1,1,0,0,0-1.09.2,1,1,0,0,0-.2,1.09,9,9,0,0,0,1.52,2.3,1,1,0,0,0,.69.26,1,1,0,0,0,.21,0,1,1,0,0,0,.69-.21,12.63,12.63,0,0,0,4-8.4A13.43,13.43,0,0,0,20.32,3.38Z"/><circle cx="8.5" cy="12.5" r="1.5"></circle><circle cx="15.5" cy="12.5" r="1.5"></circle></svg>
                      <a href="https://discord.com/users/586988312980357141" target="_blank">a8kj</a>
                    </li>
                  </ul></div>`
      }
    };

    // --- COMMANDS ---
    const commands = {
      help: {
        description: 'Shows this help message or details for a specific command.',
        action: (args) => {
          if (args.length === 0) {
            let helpText = '<strong>Available commands:</strong><br>';
            for (const [name, command] of Object.entries(commands)) {
              helpText += `<span style="display: inline-block; width: 90px;"><strong>${name}</strong></span> - ${command.description}<br>`;
            }
            return helpText;
          } else {
            const commandName = args[0];
            const command = commands[commandName];
            if (command) {
              if (commandName === 'color') {
                return `Usage: <strong>color &lt;theme&gt;</strong><br>Changes the portfolio's visual theme.<br>Available themes: <strong>${Object.keys(themes).join(', ')}</strong>`;
              }
              return `<strong>${commandName}</strong>: ${command.description}`;
            } else {
              return `No help found for '${commandName}'.`;
            }
          }
        }
      },
      about: { description: 'Displays the "About Me" section.', action: () => { activeSections['about'] = sectionsContent.about; return `Loading 'About Me'...`; } },
      skills: { description: 'Lists my technical skills.', action: () => { activeSections['skills'] = sectionsContent.skills; return `Loading 'Skills'...`; } },
      projects: { description: 'Shows my portfolio of projects.', action: () => { activeSections['projects'] = sectionsContent.projects; return `Loading 'Projects'...`; } },
      education: { description: 'Shows my educational background.', action: () => { activeSections['education'] = sectionsContent.education; return `Loading 'Education'...`; } },
      contact: { description: 'Shows my contact information & profiles.', action: () => { activeSections['contact'] = sectionsContent.contact; return `Loading 'Contact'...`; } },
      'show all': { description: 'Displays all sections at once.', action: () => { Object.assign(activeSections, sectionsContent); return `Loading all sections...`; } },
      color: {
        description: 'Changes the visual theme. Use "help color" for more info.',
        action: (args) => {
          const themeName = args[0];
          if (themes[themeName]) {
            const theme = themes[themeName];
            for (const [key, value] of Object.entries(theme)) {
              document.documentElement.style.setProperty(key, value);
            }
            return `Theme changed to '${themeName}'.`;
          }
          return `Theme not found. Available: ${Object.keys(themes).join(', ')}`;
        }
      },
      clear: { description: 'Clears the terminal screen.', action: () => { commandHistory.value = []; return 'CLEAR'; } },
      reset: { description: 'Resets the page and clears the terminal.', action: () => { commandHistory.value = []; for (const key in activeSections) { delete activeSections[key]; }; return 'Terminal and page have been reset.'; } }
    };

    // --- NEW: History Navigation ---
    const navigateHistory = (direction) => {
      const history = typedCommandHistory.value;
      if (history.length === 0) return;

      if (historyNavigatorIndex.value === null) {
        draftCommand = commandInput.value;
        historyNavigatorIndex.value = history.length;
      }

      if (direction === 'up') {
        if (historyNavigatorIndex.value > 0) {
          historyNavigatorIndex.value--;
          commandInput.value = history[historyNavigatorIndex.value];
        }
      } else { // 'down'
        if (historyNavigatorIndex.value < history.length - 1) {
          historyNavigatorIndex.value++;
          commandInput.value = history[historyNavigatorIndex.value];
        } else {
          historyNavigatorIndex.value = null;
          commandInput.value = draftCommand;
        }
      }
    };

    // --- LOGIC ---
    const welcomeMessage = { type: 'response', text: "Welcome! I'm Ibrahim Athamaneh. Type 'help' for commands." };
    const handleCommand = () => {
      const userInput = commandInput.value;
      const fullInput = userInput.trim().toLowerCase();
      if (!fullInput) return;

      if (userInput.trim() && userInput.trim() !== typedCommandHistory.value[typedCommandHistory.value.length - 1]) {
        typedCommandHistory.value.push(userInput.trim());
      }
      historyNavigatorIndex.value = null;

      commandHistory.value.push({ type: 'command', text: userInput });

      let commandName = fullInput;
      let args = [];
      let commandObject;

      if (commands[fullInput]) {
        commandObject = commands[fullInput];
      } else {
        const parts = fullInput.split(/\s+/);
        commandName = parts[0];
        args = parts.slice(1);
        commandObject = commands[commandName];
      }

      if (commandObject && typeof commandObject.action === 'function') {
        const output = commandObject.action(args);
        if (output !== 'CLEAR') {
          commandHistory.value.push({ type: 'response', text: output });
        }
      } else {
        commandHistory.value.push({ type: 'error', text: `Command not found: '${fullInput}'. Type 'help'.` });
      }

      commandInput.value = "";
      nextTick(() => { if (terminalOutput.value) terminalOutput.value.scrollTop = terminalOutput.value.scrollHeight; });
    };

    const minimizeTerminal = () => { isTerminalOpen.value = false; };
    const openTerminal = () => { isTerminalOpen.value = true; if (commandHistory.value.length === 0) commandHistory.value.push(welcomeMessage); nextTick(() => commandInputRef.value?.focus()); };

    return {
      isTerminalOpen, commandInput, commandHistory, activeSections, appStyle,
      terminalRef, terminalOutput, commandInputRef,
      openTerminal, minimizeTerminal, handleCommand, navigateHistory, focusInput: () => commandInputRef.value?.focus(), startResize
    };
  }
}).mount('#app');