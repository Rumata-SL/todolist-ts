import {tasksReducer} from "../features/TodolistsList/tasks-reducer";
import {todolistsReducer} from "../features/TodolistsList/todolists-reducer";
import {combineReducers} from "redux"
import thunkMiddleware from "redux-thunk"
import {appReducer} from "./app-reducer"
import {authReducer} from "../features/Login/auth-reducer"
import {configureStore} from "@reduxjs/toolkit";
import {useDispatch} from "react-redux";

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})
// непосредственно создаём store
// export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
// определить автоматически тип всего объекта состояния
export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunkMiddleware)
})
export type RootReducerType = typeof rootReducer
export type AppRootStateType = ReturnType<RootReducerType>

// export type AppRootActionsType =
// export type ThunkType<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, Action>

export type AppDispatchType = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatchType>()


// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;
