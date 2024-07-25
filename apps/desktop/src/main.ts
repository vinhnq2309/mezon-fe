import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import { machineId } from 'node-machine-id';
import * as path from 'path';
import { join } from 'path';
import { format } from 'url';
import App from './app/app';
import { rendererAppName } from './app/constants';
import ElectronEvents from './app/events/electron.events';
import SquirrelEvents from './app/events/squirrel.events';
import { environment } from './environments/environment';

export default class Main {
	static initialize() {
		if (SquirrelEvents.handleEvents()) {
			// squirrel event handled (except first run event) and app will exit in 1000ms, so don't do anything else
			app.quit();
		}
	}

	static bootstrapApp() {
		App.main(app, BrowserWindow);
	}

	static bootstrapAppEvents() {
		ElectronEvents.bootstrapElectronEvents();

		// initialize auto updater service
		if (!App.isDevelopmentMode()) {
			// UpdateEvents.initAutoUpdateService();
		}
	}
}

ipcMain.handle('sender-id', () => {
	return environment.senderId;
});

ipcMain.handle('get-device-id', async () => {
	return await machineId();
});

ipcMain.on('navigate-to-url', async (event, path, isSubPath) => {
	if (App.mainWindow) {
		const baseUrl = join(__dirname, '..', rendererAppName, 'index.html');

		if (path && !isSubPath) {
			App.mainWindow.loadURL(
				format({
					pathname: baseUrl,
					protocol: 'file:',
					slashes: true,
					query: { notificationPath: path },
				}),
			);
		}

		if (!App.mainWindow.isVisible()) {
			App.mainWindow.show();
		}
		App.mainWindow.focus();
	}
});

log.transports.file.resolvePathFn = () => path.join('D:/NCC/PROJECT/mezon-fe/apps/desktop', 'logs/main.log');
autoUpdater.autoDownload = false;
log.info('App starting...');

autoUpdater.on('checking-for-update', () => {
	log.info('checking-for-update');
	dialog.showMessageBox({
		message: `CHECKING FOR UPDATES ${app.getVersion()}!!`,
	});
});

autoUpdater.on('update-available', () => {
	log.info('update-available');
	dialog.showMessageBox({
		message: ' update-available !!',
	});
	autoUpdater.downloadUpdate();
});

autoUpdater.on('update-not-available', () => {
	log.info('update-not-available');
	dialog.showMessageBox({
		message: 'update-not-available !!',
	});
});

autoUpdater.on('update-downloaded', () => {
	log.info('update-downloaded: ', app.getVersion());
	dialog.showMessageBox({
		message: 'update Downloaded !!',
	});
});

autoUpdater.on('download-progress', (progressObj) => {
	let log_message = 'Download speed: ' + progressObj.bytesPerSecond;
	log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
	log_message = log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')';
	log.info('download-progress: ', log_message);
	dialog.showMessageBox({
		message: `update Downloaded: ${log_message} !!`,
	});
});

autoUpdater.on('error', (error) => {
	dialog.showMessageBox({
		message: `err: ${error.message} !!`,
	});
	dialog.showMessageBox({
		message: `err1: ${error} !!`,
	});
});

// handle setup events as quickly as possible
Main.initialize();

// bootstrap app
Main.bootstrapApp();
Main.bootstrapAppEvents();
