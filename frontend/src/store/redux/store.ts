import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers/index";
import createSagaMiddleware from "@redux-saga/core";
import { useDispatch } from "react-redux";
import cafeSaga from "./sagas/cafe";
import employeeSaga from "./sagas/employee";

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(cafeSaga);
sagaMiddleware.run(employeeSaga);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export default store;