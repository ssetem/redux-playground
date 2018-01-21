import { combineReducers, createStore } from "redux"
export const ADD_TODO = "ADD_TODO"
export const REMOVE_TODO = "REMOVE_TODO"
export const SELECT_TODO = "SELECT_TODO"
export const SET_SESSION_LOADING = "SET_SESSION_LOADING"
export const SET_SESSION_ERROR = "SET_SESSION_ERROR"
export const SET_SESSION_RESULT = "SET_SESSION_RESULT"
import { createAction, createReducer } from "./redux-helpers"

import * as fp from "lodash/fp"

export const addTodo = createAction(ADD_TODO, 'text')
export const removeTodo = createAction(REMOVE_TODO, 'text')
export const selectTodo = createAction(SELECT_TODO, 'text')
export const setSessionLoading = createAction(SET_SESSION_LOADING, 'loading')
export const setSessionResult = createAction(SET_SESSION_RESULT, 'result')
export const setSessionError = createAction(SET_SESSION_ERROR, 'error')

export const getTodos = fp.property('todos.list')
export const getSelected = fp.property('todos.selected')
export const getSessionLoading = fp.property('session.loading')



const acceptAction = (initialState, type, fn)=> {
    return (state=initialState, action)=> {
        if(action.type === type){
            return fn(state, action)
        } else {
            return state
        }
    }
}
const prop = (key) => (state, action)=> action[key]    
const add = (fn) => (state, action) => [...state, fn(state, action)]
const remove = (fn) => (state, action) => fp.without([fn(state, action)], state)
const eq = (fn)=> (state, action)=> state === fn(state, action)
const nullIf = (fn) => (state, action) => fn(state, action)? null : state
    

const list = createReducer([], {
    [ADD_TODO]: add(prop('text')),
    [REMOVE_TODO]: remove(prop('text'))
})
const selected = createReducer(null, {
    [REMOVE_TODO]: nullIf(eq(prop('text'))),
    [SELECT_TODO]: prop('text')     
})
        
let reducers = combineReducers({
    todos:combineReducers({
        list,
        selected
    }),
    session:combineReducers({
        loading: acceptAction(false, SET_SESSION_LOADING, prop('loading')),
        result: acceptAction(null, SET_SESSION_RESULT, prop('result')),
        error: acceptAction(null, SET_SESSION_ERROR, prop('error'))
    })
})

const outlets = {
    
}

export const store = createStore(reducers)