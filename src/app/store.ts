import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import notificationReducer from '../components/notification/notification-reducer';
import searchReducer from '../features/search/search-reducer';

export const store = configureStore({
  reducer: {
    search: searchReducer,
    notification: notificationReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
