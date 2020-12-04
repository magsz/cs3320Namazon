import React from 'react';
import axios from 'axios';
import Store from "../Store/store";
import "./login.css"
import UserCart from "../Cart/userCart";

class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            login:'',
            password:'',
            storeItems:[]
        }

        this.loginEventHandler = this.loginEventHandler.bind(this);
        this.loginInputHandler  = this.loginInputHandler.bind(this);
        this.loginPasswordHandler = this.loginPasswordHandler.bind(this);
    }

    async loginEventHandler(){
        try {
            const loginBody = {
                login: this.state.login,
                password: this.state.password
            }

            const response = (await axios.post('http://localhost:8080/user/login', loginBody)).data;
            this.setState({accessToken: response.accessToken, user: response.user});
        }catch(err) {
            console.log(err);
        }

    }

    loginInputHandler(event){
        this.setState({login:event.target.value})
    }

    loginPasswordHandler(event){
        this.setState({password:event.target.value})
    }

    welcomeUser() {
        if(this.state.user){
            return (
               <div> Welcome {this.state.user.firstName}!</div>
            )
        }
     }

     displayCart(){
        if(this.state.user){
            return(
                <UserCart user={this.state.user} accessToken={this.state.accessToken}/>
            )
        }
     }

    displayStore() {
        if(this.state.user) {
            return (
                <Store user={this.state.user} accessToken={this.state.accessToken}/>
            )
        }
    }

    loginForm() {
        if(!this.state.user){
            return (
                <div className="LoginInput">
                    <input placeholder="Login" className="LoginBox" onChange={this.loginInputHandler}></input>
                    <input type="password" placeholder="Password" className="PasswordBox" onChange={this.loginPasswordHandler}></input>
                    <button className="LoginButton" onClick={this.loginEventHandler}>Log In!</button>
                </div>
            )
        }
    }

    render(){
        return(
            <div className="Login">
               <div className="LoginBoxContainer">{this.loginForm()}</div>
                <div className="Welcome">{this.welcomeUser()}</div>
                <div className="ViewCart">{this.displayCart()}</div>
                <div>{this.displayStore()}</div>
            </div>
        )
    }
}
export default Login;

