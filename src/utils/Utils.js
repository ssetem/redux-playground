import shallowequal from "shallowequal"
import difflet from "difflet"
import { bindActionCreators } from "redux"
let _ = require("lodash")

export function createAction(type, ...argNames) {
    let action = function (...args) {
        let action = { type }
        argNames.forEach((arg, index) => {
            action[argNames[index]] = args[index]
        })
        return action
    }
    action.type = type
    return action
}

export function createReducer(initialState, handlers) {
    return function reducer(state = initialState, action) {
        if (handlers.hasOwnProperty(action.type)) {
            return handlers[action.type](state, action)
        } else {
            return state
        }
    }
}

export const actionProp = (key) => (state, action) => action[key]
export const increment = (state, action) => state + 1
export const decrement = (state, action) => state - 1
export const union = (fn) => (state, action) => _.union(state, [fn(state, action)])
export const add = (fn) => (state, action) => [...state, fn(state, action)]
export const remove = (fn) => (state, action) => _.without(state, [fn(state, action)])
export const eq = (fn) => (state, action) => state === fn(state, action)
export const nullIf = (fn) => (state, action) => fn(state, action) ? null : state

export const indexByKey = (key, actions, subreducer) => {
    return (state = {}, action) => {
        if (actions.indexOf(action.type) > -1) {
            return {
                ...state,
                [action[key]]: subreducer(state[action[key]], action)
            }
        }
        return state
    }
}

export const singleReduce = (initialState, type, fn) => {
    return (state = initialState, action) => {
        if (action.type === type) {
            return fn(state, action)
        } else {
            return state
        }
    }
}

export const connectOutletToStore = (outlet, store, options={ownProps:{}})=> {
    const [mapStateToProps, mapDispatchToProps={}] = outlet
    let previousProps = {}
    let statefulOutlet = {        
        ownProps:options.ownProps,
        props:{},
        actions:{},    
        propsChanged:false    
    }
    const loadState = () => {
        let props = mapStateToProps(store.getState(), statefulOutlet.ownProps)
        previousProps = statefulOutlet.props
        statefulOutlet.props = props
        statefulOutlet.propsChanged = !shallowequal(previousProps, statefulOutlet.props)
        statefulOutlet.actions = bindActionCreators(mapDispatchToProps, store.dispatch)
    }

    statefulOutlet.setOwnProps = (ownProps)=> {
        statefulOutlet.ownProps = {
            ...statefulOutlet.ownProps, 
            ...ownProps
        }
        loadState()
    }

    statefulOutlet.getPreviousProps = ()=> {
        return previousProps
    }

    store.subscribe(loadState)
    loadState()
    return statefulOutlet
}

export const logOutletChanges = (outlet)=> {
    if(outlet.propsChanged) {
        console.log(difflet({ indent: 2, comment: true }).compare(
            outlet.getPreviousProps(), outlet.props
        ))   
    } else {
        console.log("No changes detected")
    }
    
}