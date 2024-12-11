let myDemoTerminal;

function schoolPride() {
    var end = Date.now() + 2 * 1000;

    // go Buckeyes!
    var colors = ['#bb0000', '#ffffff'];

    (function frame() {
        confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors,
        });
        confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors,
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
}

function fireWorks() {
    var duration = 2 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function () {
        var timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        var particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
}

$(document).ready(function () {
    // let myDemoTerminal2;
    let commands = [
        {
            command: 'hello',
            description: 'Says hello',
            action: async (terminal, args) => terminal.write('\r\nHello! ' + args.join(' ')),
        },
        {
            command: 'theme',
            description: 'Change the website theme',
            subCommands: [
                {
                    command: 'set',
                    description: 'Set the website theme to light or dark',
                    action: async (terminal, args) => {
                        let theme = args[0];
                        if (theme === 'light') {
                            document.body.setAttribute('data-bs-theme', 'light');
                            myDemoTerminal.setTheme('light');
                        } else {
                            document.body.setAttribute('data-bs-theme', 'dark');
                            myDemoTerminal.setTheme('dark');
                        }
                        terminal.write('\r\nsetting theme to ' + args[0]);
                    },
                },
                {
                    command: 'list',
                    description: 'List all available themes',
                    action: async (terminal, args) => {
                        let list = ['light', 'dark'];
                        list.forEach((theme) => {
                            terminal.write('\r\n' + theme);
                        });
                    },
                },
            ],
        },
        {
            command: 'poppers',
            description: 'Poppers/School Pride animation',
            action: async (terminal, args) => {
                schoolPride();
                terminal.write('\r\nGo Buckeyes!');
            },
        },
        {
            command: 'fireworks',
            description: 'Fireworks animation',
            action: async (terminal, args) => {
                fireWorks();
                terminal.write('\r\nFireworks!');
            },
        },
    ];
    myDemoTerminal = new termo({
        commands: commands,
        title: 'bterm v1.0.02',
        fontFamily: 'Sono',
        theme: 'dark',
        prompt: 'bterm@localhost:$',
    });
    myDemoTerminal.create();

    $('#fireup').click(function (e) {
        myDemoTerminal.show();
    });

    // if c is pressed, hide the terminal
    $(document).keypress(function (e) {
        if (e.which === 99) {
            e.preventDefault();
            myDemoTerminal.show();
        }
    });

    hljs.highlightAll();
});
