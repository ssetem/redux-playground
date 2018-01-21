import { get } from "axios"
import * as fp from "lodash/fp"
import { createAction, createReducer } from "./utils"
import thunk from "redux-thunk"
import { combineReducers, createStore, applyMiddleware, bindActionCreators } from "redux"
import R from "ramda"
import shallowequal from "shallowequal"
import difflet from "difflet"

const acceptAction = (initialState, type, fn) => {
    return (state = initialState, action) => {
        if (action.type === type) {
            return fn(state, action)
        } else {
            return state
        }
    }
}
const prop = (key) => (state, action) => action[key]
const add = (fn) => (state, action) => [...state, fn(state, action)]
const remove = (fn) => (state, action) => fp.without([fn(state, action)], state)
const eq = (fn) => (state, action) => state === fn(state, action)
const nullIf = (fn) => (state, action) => fn(state, action) ? null : state
const returns = (value)=> ()=> value

export const types = {
    REQUEST_POSTS:"REQUEST_POSTS",
    RECIEVED_POSTS:"RECIEVED_POSTS",
    SET_SUBREDDITS:"SET_SUBREDDITS"
}

export const mapPostsResponse = (data)=> {
    let posts = R.map(R.prop('data'))(data.children)
    let byId = R.indexBy(R.prop("id"))(posts)
    let ids = R.map(R.prop("id"))(posts)
    let {before, after} = data
    return {
        byId,
        ids,
        before,
        after
    }
}
export const actions = {
    requestPosts:createAction(types.REQUEST_POSTS, "subreddit"),
    recievedPosts: createAction(types.RECIEVED_POSTS, "subreddit", "results"),
    setSubreddits:createAction(types.SET_SUBREDDITS, "subreddits"),
    loadPosts: (subreddit) => async (dispatch, getState) => {        
        dispatch(actions.requestPosts(subreddit))   
        let url = `https://www.reddit.com/r/${subreddit}.json`
        console.log(url)
        // let results = await get(url)     
        // results = mapPostsResponse(results.data.data)
        // return dispatch(actions.recievedPosts(subreddit, results))        
    }
}

const postsReducer = combineReducers({
    results:acceptAction({}, types.RECIEVED_POSTS, prop("results") ),
    loading:createReducer(false, {
        [types.REQUEST_POSTS]: returns(true),
        [types.RECIEVED_POSTS]: returns(false)
    })
})

const postsBySubreddit = (state={}, action)=> {
    const {subreddit} = action
    switch(action.type) {
        case types.RECIEVED_POSTS:
        case types.REQUEST_POSTS:
            return {
                ...state,
                [subreddit]: postsReducer(
                    state[subreddit], action
                )
            }
        default:
            return state
    }
}


export const reducers = combineReducers({
    postsBySubreddit,
    subreddits: createReducer([], {
        [types.SET_SUBREDDITS]: prop("subreddits")
    })
})

export const configureStore =  ()=> createStore(
    reducers, 
    {subreddits:['javascript', 'reduxjs']},
    applyMiddleware(thunk)
)

export const bindOutlet = (store, outlet)=> {
    const [mapStateToProps, mapDispatchToProps] = outlet
    return ()=> ({
        ...mapStateToProps(store.getState()),
        ...bindActionCreators(mapDispatchToProps, store.dispatch)
    })
}

export class Outlet {
    constructor(name, mapStateToProps, mapDispatchToProps){
        this.name = name
        this.mapStateToProps = mapStateToProps
        this.mapDispatchToProps = mapDispatchToProps
        this.props = {}
    }

    bindToStore(store){
        store.subscribe(()=> {
            let props = this.mapStateToProps(store.getState())            
            if(!shallowequal(this.props, props)){
                console.log(`Outlet: ${this.name} changed`)
                console.log(difflet({ indent: 2, comment: true }).compare(
                    this.props, props                  
                ))                
            }
            this.props = props
            this.propsAndActions = {
                ...props,
                ...bindActionCreators(this.mapStateToProps, store.dispatch)
            }
        })
    }

    get() {
        return [this.mapStateToProps, this.mapDispatchToProps]
    }
}

export const outlets = {
    subredditList:new Outlet('subredditList', 
        (state)=> ({subreddits:state.subreddits}),
        {loadPosts:actions.loadPosts}        
    )

}