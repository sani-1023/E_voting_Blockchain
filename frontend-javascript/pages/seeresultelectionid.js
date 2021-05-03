

//electionresults
import React from "react";
import styles from "../styles/Home.module.css";



export default class SeeResultelectionId extends React.Component {
    state = {
        loading: true,
        result:[],
        result1:[]
    };

    async componentDidMount() {
        const url = "http://localhost:3000/seeresultelectionid";

        const response = await fetch(url, {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            withCredentials: true,
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            //body: JSON.stringify(requestBody), // body data type must match "Content-Type" header
        });
        const data = await response.json();

        console.log(data);

        // let obj = JSON.stringify(data);
        // console.log(data[0].Record.electionName);
        this.setState({result:data})
        //this.setState({result1:data.Record}) //[0].Record.electionName})
        // this.setState({result:data[0].Record.finalResult})

        //  console.log(data[0].Record.finalResult);

        //this.setState({ Key: data.Key[0], loading: false });
    }
    render() {
    

       if (!this.state.result.length) {
           return <div className={styles.card2}>No results Yet</div>;
        }

        return (
            <div>
                {this.state.result.map(r=>(
                    <div className={styles.card2} key={r.Record.key}>
                        <div>Election Name: {r.Record.electionName}</div>
                        <div>Results:  {r.Record.finalResult}</div>
                    </div>


                ))

                }
            </div>
    );

    }
}
