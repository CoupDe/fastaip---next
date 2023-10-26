import { configureStore, combineReducers } from "@reduxjs/toolkit";
import buildingSlice from "../slice/buildingSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uploadSlice from "../slice/uploadSlice";
import visrSlice from "../slice/structureVisrData";
// import storage from 'redux-persist/lib/storage'

//Объединение редюсеров из слайсов

const rootReducer = combineReducers({
  building: buildingSlice,
  uploadVisr: uploadSlice,
  visr: visrSlice,
});
const buildingPersistConfig = {
  key: "building",
  storage: AsyncStorage,
  whiteList: ["building"],
  blacklist: ["uploadVisr", "visr"],
};
//

//
const persistedReducer = persistReducer(buildingPersistConfig, rootReducer);
const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        warnAfter: 200, //Изменить предупреждение о ошибке в связи с долгой загрузкой данных
      },
    }),
});

export const persistor = persistStore(store);

export default store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
