import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { QueryProvider } from './providers/QueryProvider';
import { HomeScreen } from '../screens/home/HomeScreen';

export const App = () => {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <QueryProvider>
          <View style={styles.content}>
            <StatusBar
              barStyle="light-content"
              backgroundColor="transparent"
              translucent
            />
            <HomeScreen />
          </View>
        </QueryProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
