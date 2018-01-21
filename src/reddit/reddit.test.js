import { configureStore, actions, outlets, bindOutlet } from "./actions"

describe("reddit", function(){


    it("should work", async ()=> {
        let store = configureStore()
        outlets.subredditList.bindToStore(store)
        store.dispatch(actions.setSubreddits(['ts']))        
        store.dispatch(actions.setSubreddits(['ts', 'js']))
        // store.dispatch(actions.loadPosts("javascript"))
        // await store.dispatch(actions.loadPosts("reduxjs"))
    })
})