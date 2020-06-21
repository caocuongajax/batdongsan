import React from 'react';
import { StatusBar } from 'react-native';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { mapping, light as theme } from '@eva-design/eva';
import { default as appTheme } from './custom-theme.json';
import AppNavigation from './navigation';

console.disableYellowBox = true

const App = () => {
    return (
        <>
            <StatusBar translucent backgroundColor="rgba(247, 247, 247, 0.7)" barStyle="dark-content" />
            <IconRegistry icons={EvaIconsPack} />
            <ApplicationProvider mapping={mapping} theme={{ ...theme, ...appTheme }}>
                <AppNavigation />
            </ApplicationProvider>
        </>
    )
}

export default App;