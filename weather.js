#!/usr/bin/env node
import { getArgs } from './helpers/args.js';
import { getWeather } from './services/api.service.js';
import { printHelp, printSuccess, printError } from './services/log.service.js';
import { saveKeyValue, TOKEN_DICTIONARY } from './services/storage.service.js';

const saveToken = async (token) => {
    if (!token.length) {
        printError('Не передан токен!');
        return;
    }
    try {
        await saveKeyValue(TOKEN_DICTIONARY.token, token);
        printSuccess('Токен сохранён!');
    } catch (ex) {
        printError(ex.message);
    }
};

const getForcast = async () => {
    try {
        const weather = await getWeather('Moscow');
        console.log(weather); 
    } catch (ex) {
        if (ex?.response?.status === 404) {
            printError('Неверно указан город!');
        } else if (ex?.response?.status === 401) {
            printError('Неверно указан токен!');
        } else {
            printError(ex.message);
        }
    }
     
};

const initCLI = async () => {
    const args = getArgs(process.argv);
    if (args.h) {
        printHelp();
    }
    if (args.s) {
        //save city
    }
    if (args.t) {
        return saveToken(args.t);
    }

    await getForcast();
};

initCLI();