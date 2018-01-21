import { 
    store, addTodo, getTodos, 
    removeTodo, selectTodo, getSelected,
    setSessionLoading, getSessionLoading
} from "./redux"
import { without, property } from "lodash/fp"
import { bindActionCreators } from "redux"
import {mapValues} from "lodash"

let bindSelectors = (selectors, getState)=> {
    return mapValues(selectors, (selector)=> {
        return ()=> selector(getState())
    })
}
describe("Redux tests", function(){

    it("store should work", ()=> {
        let actions = bindActionCreators({
            addTodo, selectTodo, removeTodo,
            setSessionLoading
        }, store.dispatch)
        let selectors = bindSelectors({
            getTodos, getSelected,
            getSessionLoading
        }, store.getState)


        actions.addTodo("shopping")
        actions.addTodo("cooking")

        expect(selectors.getTodos()).toEqual([
            'shopping', 'cooking'])
            
        actions.selectTodo('shopping')        
        expect(selectors.getSelected()).toEqual('shopping')
        actions.removeTodo('cooking')
        expect(selectors.getTodos()).toEqual(['shopping'])
        actions.removeTodo('shopping')
        expect(selectors.getTodos()).toEqual([])
        expect(selectors.getSelected()).toEqual(null)

        actions.setSessionLoading(true)
        expect(selectors.getSessionLoading()).toEqual(true)
        actions.setSessionLoading(false)
        expect(selectors.getSessionLoading()).toEqual(false)
        console.log(store.getState())
    })
})