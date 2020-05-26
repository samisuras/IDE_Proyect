const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

/*if(process.env.NODE_ENV !== 'production') {
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
    });
}*/

let mainWindow;

//Carga de inicio
app.on('ready', () => {

    mainWindow = new BrowserWindow();
    mainWindow.loadURL(
       // path.join(__dirname, 'public/components/login/login.ejs')
        path.join(__dirname, 'public/index.html')
    );

    mainWindow.maximize();

    const mainMenu = Menu.buildFromTemplate(templateMenu);
    Menu.setApplicationMenu(mainMenu);
});

const templateMenu = [];

if (process.env.NODE_ENV !== 'production') {
    templateMenu.push({
      label: 'DevTools',
      submenu: [
        {
          label: 'Show/Hide Dev Tools',
          accelerator: process.platform == 'darwin' ? 'Comand+D' : 'Ctrl+D',
          click(item, focusedWindow) {
            focusedWindow.toggleDevTools();
          }
        },
        {
          role: 'reload'
        }
      ]
    })
}
