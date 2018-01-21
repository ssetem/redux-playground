import * as React from "react"
import { Provider, connect } from "react-redux"
import { configureStore, outlets } from "./shopping"

let store = configureStore()



let Cart = ({ items, total, removeProduct }) => {
    return (
        <div>
            <table>
                <thead>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th></th>
                </thead>
                <tbody>

                    {items.map((item) => {
                        return (
                            <tr>
                                <td>{item.product.name}</td>
                                <td>{item.quantity}</td>
                                <td>£{item.totalPrice}</td>
                                <td><span onClick={()=> removeProduct(item.product.id)}>x</span></td>
                            </tr>
                        )
                    })}
                    <tr>
                        <td></td>
                        <td>total:</td>
                        <td>£{total}</td>
                    </tr>
                </tbody>
            </table>
          
        </div>
    )
}

Cart = connect(...outlets.cart)(Cart)


let Products = ({ products, addProduct }) => {
    return (
        <ul>
            {products.map((product) => {
                return <li
                    onClick={()=> addProduct(product.id)} 
                    key={product.id}>{product.name} £{product.price}</li>
            })}
        </ul>
    )
}

Products = connect(...outlets.products)(Products)

export default () => {
    return (
        <Provider store={store}>
            <div>
                <Products />
                <Cart />
            </div>
        </Provider>
    )
}
