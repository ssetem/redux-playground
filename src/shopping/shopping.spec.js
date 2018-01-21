import { configureStore, actions, selectors, outlets } from "./shopping"
import { bindOutlet, connectOutletToStore, logOutletChanges } from "../utils/Utils"

describe("shopping", function () {

    fit("testing stateful outlets", ()=> {
        const store = configureStore()
        let cartOutlet = connectOutletToStore(outlets.cart, store)
        let productOutlet = connectOutletToStore(outlets.products, store)
        expect(cartOutlet.props).toMatchSnapshot()
        cartOutlet.actions.addProduct("1")        
        expect(cartOutlet.props).toMatchSnapshot()
        cartOutlet.actions.addProduct("1")        
        expect(cartOutlet.props).toMatchSnapshot()
        cartOutlet.actions.addProduct("2")        
        expect(cartOutlet.props).toMatchSnapshot()
        cartOutlet.actions.removeProduct("1")
        console.log(cartOutlet.getPreviousProps())  
        console.log(cartOutlet)        
        // cartOutlet.actions.removeProduct("1")
        expect(cartOutlet.props).toMatchSnapshot()
        cartOutlet.actions.removeProduct("1")
        expect(cartOutlet.props).toMatchSnapshot()
        cartOutlet.actions.removeProduct("2")
        console.log(cartOutlet.props)
        
    })

    it("test own props", ()=> {
        const store = configureStore()
        let productOutletByOwnprops = [
            (state, ownProps)=> {
                return {
                    product:state.products.byId[ownProps.productId]
                }
            }
        ]

        let outlet = bindOutletAndListen(
            productOutletByOwnprops, 
            store, 
            {ownProps:{productId:"1"}}
        )
        outlet.setOwnProps({productId:"2"})
        outlet.logChanges()
        console.log(outlet)
        
    })
})