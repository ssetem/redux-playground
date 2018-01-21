import {
    combineReducers, createStore,
    applyMiddleware, compose
} from "redux"
import { 
    createAction, createReducer, singleReduce, decrement,
    actionProp, union, indexByKey, increment, remove
} from "../utils/Utils"
import _ from "lodash"
import thunk from "redux-thunk"
import { createSelector } from "reselect"

const property = require("lodash/property")

export const types = {
    ADD_PRODUCT: "ADD_PRODUCT",
    REMOVE_PRODUCT: "REMOVE_PRODUCT"
}
export const actions = {
    addProduct: createAction(types.ADD_PRODUCT, "productId"),
    removeProduct: createAction(types.REMOVE_PRODUCT, "productId")
}

const initialProducts = {
    byId: {
        "1": { id: "1", name: "iPhone X", price: 1000 },
        "2": { id: "2", name: "Galaxy Note 8", price: 800 },
        "3": { id: "3", name: "Macbook Pro 13", price: 1400 }
    },
    ids: ["1", "2", "3"]
}

const products = createReducer(initialProducts, {})

const cart = indexByKey("productId", [types.ADD_PRODUCT, types.REMOVE_PRODUCT],
    createReducer(0, {
        [types.ADD_PRODUCT]: increment,
        [types.REMOVE_PRODUCT]: decrement
    })
)
export const reducers = combineReducers({
    products,
    cart
})


const getCartItems = createSelector(
    property("cart"),property("products.byId"),
    (cart, products) => {
        let total = 0        
        let items = _.compact(Object.keys(cart).map((id) => {
            let product = products[id]
            let quantity = cart[id]
            if(quantity < 1){
                return
            }

            let totalPrice = product.price * quantity
            total += totalPrice
            return {
                quantity, product, totalPrice
            }
        }))
        return {items, total}
    }
)
const getProductList = createSelector(
    property("products.ids"), property("products.byId"),
    (ids, byIds)=> ids.map((id)=> byIds[id])
    
)
export const selectors = { getCartItems, getProductList }

export const outlets = {
    cart: [
        (state) => {
            return getCartItems(state)                
        },
        { 
            addProduct: actions.addProduct,
            removeProduct: actions.removeProduct 
        }
    ],

    products:[
        (state)=> ({
          products:getProductList(state)
        }), 
        { addProduct: actions.addProduct }
    ]
}

export const configureStore = (initialState = {}) => {
    return createStore(
        reducers,
        initialState,
        compose(
            applyMiddleware(thunk),
            window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : _.identity
        )
    )
}

