let myDemoTerminal;
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
                        console.log('list');
                        let list = ['light', 'dark'];
                        list.forEach((theme) => {
                            terminal.write('\r\n' + theme);
                        });
                    },
                },
            ],
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
            myDemoTerminal.show();
        }
    });

    hljs.highlightAll();
});
