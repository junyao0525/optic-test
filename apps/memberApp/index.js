/**
 * @format
 */

import { AppRegistry } from 'react-native';
import 'react-native-reanimated';
import App from './App';
import { name as appName } from './app.json';
import './src/localization/i18n';

AppRegistry.registerComponent(appName, () => App);
