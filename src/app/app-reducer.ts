
import {authAPI} from '../api/todolists-api'
import {setIsLoggedInAC} from '../features/Login/auth-reducer'
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppDispatchType} from "./store";


const initialState: InitialStateType = {
    status: 'idle',
    error: null,
    isInitialized: false
}
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const slice = createSlice({
    name:"app",
    initialState: initialState,
    reducers:{
        setAppStatusAC: (state, action:PayloadAction<{status:RequestStatusType}>)=>{
            state.status = action.payload.status
        },
        setAppErrorAC: (state, action: PayloadAction<{error: string | null}>)=>{
            state.error = action.payload.error
        },
        setAppInitializedAC: (state, action:PayloadAction<{isInitialized:boolean}>)=>{
            state.isInitialized = action.payload.isInitialized
        }

    }
})
export  const appReducer = slice.reducer

export const {setAppStatusAC, setAppErrorAC, setAppInitializedAC} = slice.actions

export const initializeAppTC = () => (dispatch: AppDispatchType) => {
    authAPI.me().then(res => {
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({value:true}));
        } else {

        }
        dispatch(setAppInitializedAC({isInitialized: true}));
    })
}

export type InitialStateType = {
    // происходит ли сейчас взаимодействие с сервером
    status: RequestStatusType
    // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
    error: string | null
    // true когда приложение проинициализировалось (проверили юзера, настройки получили и т.д.)
    isInitialized: boolean
}

/*export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
export const setAppErrorAC = (error: string | null) => ({type: 'APP/SET-ERROR', error} as const)
export const setAppInitializedAC = (value: boolean) => ({type:
 'APP/SET-IS-INITIALIZED', value} as const)*/



// export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
// export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>


/*type ActionsType =
    | SetAppErrorActionType
    | SetAppStatusActionType
    | ReturnType<typeof setAppInitializedAC>*/
/*export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        case 'APP/SET-IS-INITIALIZED':
            return {...state, isInitialized: action.value}
        default:
            return {...state}
    }
}*/