import { init } from '@rematch/core';
import persistPlugin from '@rematch/persist';
import storage from 'redux-persist/lib/storage';
import models from './models';

const persistConfig = {
  key: 'root',
  storage,
};

const store = init({
  models,
  plugins: [persistPlugin(persistConfig)],
});

export default store;
