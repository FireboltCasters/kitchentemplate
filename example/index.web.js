/**
 * This file handles Web-App Builds
 * If you want to adapt the iOS and Android Entryfile open: index.js
 */

import { registerRootComponent } from 'expo';
//import App from './src/KitchenHelper/App'
import {App, ConfigHolder} from 'kitcheningredients'

import {MyDirectusStorageWeb} from "kitcheningredients/lib/module/ignoreCoverage/KitchenHelper/storage/MyDirectusStorageWeb";
import Project from "./src/project/Project";
import nativebaseConfig from "./nativebase.config";
import styleConfig from "./styleConfig.json";
import config from "./config.json";
import currentpackageJson from "./package.json";
import currentpackageJsonLock from "./package-lock.json";
import thirdpartyLicense from "./thirdpartyLicense.json"
import AppConfig from "./app.config"

ConfigHolder.storage = new MyDirectusStorageWeb();
ConfigHolder.plugin = new Project()
ConfigHolder.nativebaseConfig = nativebaseConfig
ConfigHolder.styleConfig = styleConfig
ConfigHolder.config = config
ConfigHolder.currentpackageJson = currentpackageJson
ConfigHolder.currentpackageJsonLock = currentpackageJsonLock
ConfigHolder.thirdpartyLicense = thirdpartyLicense
ConfigHolder.AppConfig = AppConfig

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
registerRootComponent(App);