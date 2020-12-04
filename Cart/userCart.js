import React from 'react';
import axios from "axios";

class UserCart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cart:[]
        }

        this.loadCartFromApi = this.loadCartFromApi.bind(this);
    }

   async loadCartFromApi(){
       try {
           const headers = {
               'Authorization':`Bearer: ${this.props.accessToken}`
           }

           const response = (await axios.get(`http://localhost:8080/user/${this.props.user._id}/cart`,{headers})).data;
           const cartListItems = [];
           response.cartItems.forEach(cartItem => {
               cartListItems.push(<li className="cartList">
                   {cartItem._id}: {cartItem.quantity}: {cartItem.storeItem.description}</li>)
           })
           this.setState({cart:cartListItems});
       } catch (err) {
           console.log(err);
       }
    }

    render(){
        return(
            <div className="ViewCartContainer">
                <button>Delete</button>
                <button className="viewCartButton" onClick={this.loadCartFromApi}>View Cart!</button>
                <div className="scrollCartList">{this.state.cart}</div>
            </div>
        )
    }
}
export default UserCart