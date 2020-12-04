import React from 'react';
import axios from "axios";
import Login from "../Login/login";

export default class Store extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            search:'',
            storeList: []
        }
        this.loadStoreFromApi = this.loadStoreFromApi.bind(this);
        this.searchInputHandler = this.searchInputHandler.bind(this);
    }

    async loadStoreFromApi(event) {
        try {
            const headers = {
                'Authorization': `Bearer ${this.props.accessToken}`
            }

            const response = (await axios.get(`http://localhost:8080/StoreItem`, {headers})).data;
            const storeListItems = [];
            response.forEach(storeItem => {
                storeListItems.push(<li className="storeList">
                    <button className="ItemButtons">Add Item!
                    </button>
                    {storeItem.name}: {storeItem.quantity}: {storeItem.description}</li>)
            })
            this.setState({storeList: storeListItems});
        }catch(err)
        {
            console.log(err);
        }
        event.preventDefault();

    }

    searchInputHandler(event)
    {
        this.setState({search:event.target.value})
    }
    async searchStore(){

        const search ={
            search: this.state.search
        }
        const headers = {
            'Authorization': `Bearer ${this.props.accessToken}`
        }
        const response = (await axios.get(`http://localhost:8080/StoreItem=${this.state.search}`, {headers})).data;
        const searchItem = '';


    }

    render() {
        return(
            <div className="storeContainer">
                <button onClick={this.loadStoreFromApi}>Load Store!</button>
                <br/>
                <button>A-Z</button>
                <input placeholder="Search"></input>
                <button className="searchButton">Search</button>
                <div className="storeScrollList">{this.state.storeList}</div>
            </div>
        )

    }
}