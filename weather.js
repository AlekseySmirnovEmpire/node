#!/usr/bin/env node
import { getArgs } from './helpers/args.js';
import { getIcon, getWeather } from './services/api.service.js';
import { printHelp, printSuccess, printError, printWeather } from './services/log.service.js';
import { getKeyValue, saveKeyValue, TOKEN_DICTIONARY } from './services/storage.service.js';

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

const saveCity = async (city) => {
    if (!city.length) {
        printError('Не передан город!');
        return;
    }
    try {
        await saveKeyValue(TOKEN_DICTIONARY.city, city);
        printSuccess('Город сохранён!');
    } catch (ex) {
        printError(ex.message);
    }
};

const getForcast = async () => {
    try {
        const city = await getKeyValue(TOKEN_DICTIONARY.city) ?? 'Moscow';
        const weather = await getWeather(city);
        printWeather(weather, getIcon(weather.weather[0].icon));
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
        return printHelp();
    }
    if (args.s) {
        return saveCity(args.s);
    }
    if (args.t) {
        return saveToken(args.t);
    }

    return getForcast();
};

initCLI();