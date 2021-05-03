

//electionresults
import React from "react";
import styles from "../styles/Home.module.css";
import { Button } from 'antd';
import { useRouter } from "next/router";





export default class seeCandidates extends React.Component {

    state = {
        loading: true,
        result:[],
        result1:[]
    };

    async componentDidMount() {
        const url = "http://localhost:3000/seeCandidates";

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
        
    
       // const router = useRouter();

       if (!this.state.result.length) {
           return <div className={styles.card2}>No Candidates found</div>;
        }

        return (
            <div>
               {/* // <div>Election Id: {data[0].Record.electionId}</div> */}
                {this.state.result.map(r=>(

                    <div className={styles.card2} key={r.Record.Key}>

                        
                        <div>Candidate Name:  {r.Record.name}</div>
                        <div>Candidate Sign:  {r.Record.sign}</div>
                        <div>Candidate Id:    {r.Record.canId}</div>
                       {/* <Button onClick={()=> router.push('/castvote')} type="primary">Cast Vote</Button>  */}
                        {/* <button onclick="onFinish()">Click me</button>  */}
                        <form action="/castvote" class="inline">
                        <button class={styles.button1} >Cast Vote</button>
                        </form> 
                        
                    </div>
                    )

                    

                )

            }
            </div>
        );
 
    }
}





