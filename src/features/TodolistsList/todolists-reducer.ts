import {todolistsAPI, TodolistType} from "../../api/todolists-api"
import {RequestStatusType, setAppStatusAC,} from "../../app/app-reducer"
import {handleServerNetworkError} from "../../utils/error-utils"
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosError} from "axios";


export type FilterValuesType = "all" | "active" | "completed";

export const fetchTodolistsTC = createAsyncThunk("todolists/fetchTodolists", async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    const res = await todolistsAPI.getTodolists()
    try {
        // thunkAPI.dispatch(setTodolistsAC({todolists:res.data}))
        thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
        return {todolists: res.data}
    } catch (e) {
        const error = e as Error | AxiosError<{ error: string }>
        handleServerNetworkError(error, thunkAPI.dispatch);
        return thunkAPI.rejectWithValue(null)
    }
})

export const removeTodolistTC = createAsyncThunk("todolists/removeTodolist", async (param: { todolistId: string }, thunkAPI) => {
    //изменим глобальный статус приложения, чтобы вверху полоса побежала
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
    thunkAPI.dispatch(changeTodolistEntityStatusAC({
        id: param.todolistId,
        status: "loading"
    }))
    const res = await todolistsAPI.deleteTodolist(param.todolistId)
    try {
        // thunkAPI.dispatch(removeTodolistAC({id: param.todolistId}))
        //скажем глобально приложению, что асинхронная операция завершена
        thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
        return {id: param.todolistId}
    } catch (e) {
        const error = e as Error | AxiosError<{ error: string }>
        return thunkAPI.rejectWithValue(null)
    }
})

export const addTodolistTC = createAsyncThunk("todolists/addTodolist", async (param: { title: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    const res = await todolistsAPI.createTodolist(param.title)
    try {
        // thunkAPI.dispatch(addTodolistAC({todolist: res.data.data.item}))
        thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
        return {todolist: res.data.data.item}
    } catch (e) {
        const error = e as Error | AxiosError<{ error: string }>
        return thunkAPI.rejectWithValue(null)
    }
})

export const changeTodolistTitleTC = createAsyncThunk("todolists/changeTodolistTitle", async (param: {
    id: string,
    title: string
}, thunkAPI) => {

    const res = await todolistsAPI.updateTodolist(param.id, param.title)
        try {
            // thunkAPI.dispatch(changeTodolistTitleAC({id: param.id, title: param.title}))
            return {id: param.id, title: param.title}
        }catch (e) {
            const error = e as Error | AxiosError<{ error: string }>
            return thunkAPI.rejectWithValue(null)
        }
})

const slice = createSlice({
    name: "todolists",
    initialState: [] as Array<TodolistDomainType>,
    reducers: {
        /*addTodolistAC: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
            state.unshift({
                ...action.payload.todolist,
                filter: "all",
                entityStatus: "idle"
            })
        },*/
        /*changeTodolistTitleAC: (state, action: PayloadAction<{ id: string, title: string }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].title = action.payload.title
        },*/
        changeTodolistFilterAC: (state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].filter = action.payload.filter
        },
        changeTodolistEntityStatusAC: (state, action: PayloadAction<{ id: string, status: RequestStatusType }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].entityStatus = action.payload.status
        },
    },
    extraReducers: builder => {
        builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
            return action.payload.todolists.map(tl => ({
                ...tl,
                filter: "all",
                entityStatus: "idle"
            }))
        })
        builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            if (index > -1) {
                state.splice(index, 1)
            }
        })
        builder.addCase(addTodolistTC.fulfilled, (state, action) => {
            state.unshift({
                ...action.payload.todolist,
                filter: "all",
                entityStatus: "idle"
            })
        })
        builder.addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].title = action.payload.title
        })
    }
})

export const todolistsReducer = slice.reducer

export const {
    changeTodolistFilterAC,
    changeTodolistEntityStatusAC,
} = slice.actions

// thunks
/*export const fetchTodolistsTC_ = () => {
    return (dispatch: AppDispatchType) => {
        dispatch(setAppStatusAC({status: "loading"}))
        todolistsAPI.getTodolists()
            .then((res) => {
                dispatch(setTodolistsAC({todolists:res.data}))
                dispatch(setAppStatusAC({status: "succeeded"}))
            })
            .catch(error => {
                handleServerNetworkError(error, dispatch);
            })
    }
}*/
/*export const removeTodolistTC_ = (todolistId: string) => {
    return (dispatch: AppDispatchType) => {
        //изменим глобальный статус приложения, чтобы вверху полоса побежала
        dispatch(setAppStatusAC({status: "loading"}))
        //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
        dispatch(changeTodolistEntityStatusAC({
            id: todolistId,
            status: "loading"
        }))
        todolistsAPI.deleteTodolist(todolistId)
            .then((res) => {
                dispatch(removeTodolistAC({id: todolistId}))
                //скажем глобально приложению, что асинхронная операция завершена
                dispatch(setAppStatusAC({status: "succeeded"}))
            })
    }
}*/
/*export const addTodolistTC_ = (title: string) => {
    return (dispatch: AppDispatchType) => {
        dispatch(setAppStatusAC({status: "loading"}))
        todolistsAPI.createTodolist(title)
            .then((res) => {
                dispatch(addTodolistAC({todolist: res.data.data.item}))
                dispatch(setAppStatusAC({status: "succeeded"}))
            })
    }
}*/
/*export const changeTodolistTitleTC_ = (id: string, title: string) => {
    return (dispatch: AppDispatchType) => {
        todolistsAPI.updateTodolist(id, title)
            .then((res) => {
                dispatch(changeTodolistTitleAC({id: id, title: title}))
            })
    }
}*/

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
// types
/*export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>;*/
/*type ActionsType =
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | SetTodolistsActionType
    | ReturnType<typeof changeTodolistEntityStatusAC>*/


// type ThunkDispatch = Dispatch<ActionsType>
// type ThunkDispatch = Dispatch<ActionsType | SetAppStatusActionType | SetAppErrorActionType>

/*export const _todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return state.filter(tl => tl.id != action.id)
        case "ADD-TODOLIST":
            return [{
                ...action.todolist,
                filter: "all",
                entityStatus: "idle"
            }, ...state]

        case "CHANGE-TODOLIST-TITLE":
            return state.map(tl => tl.id === action.id ? {
                ...tl,
                title: action.title
            } : tl)
        case "CHANGE-TODOLIST-FILTER":
            return state.map(tl => tl.id === action.id ? {
                ...tl,
                filter: action.filter
            } : tl)
        case "CHANGE-TODOLIST-ENTITY-STATUS":
            return state.map(tl => tl.id === action.id ? {
                ...tl,
                entityStatus: action.status
            } : tl)
        case "SET-TODOLISTS":
            return action.todolists.map(tl => ({
                ...tl,
                filter: "all",
                entityStatus: "idle"
            }))
        default:
            return state
    }
}*/
// actions
/*export const removeTodolistAC = (id: string) => ({
    type: "REMOVE-TODOLIST",
    id
} as const)*/
/*export const addTodolistAC = (todolist: TodolistType) => ({
    type: "ADD-TODOLIST",
    todolist
} as const)*/
/*export const changeTodolistTitleAC = (id: string, title: string) => ({
    type: "CHANGE-TODOLIST-TITLE",
    id,
    title
} as const)*/
/*export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => ({
    type: "CHANGE-TODOLIST-FILTER",
    id,
    filter
} as const)*/
/*export const changeTodolistEntityStatusAC = (id: string, status: RequestStatusType) => ({
    type: "CHANGE-TODOLIST-ENTITY-STATUS", id, status
} as const)*/
/*export const setTodolistsAC = (todolists: Array<TodolistType>) => ({
    type: "SET-TODOLISTS",
    todolists
} as const)*/