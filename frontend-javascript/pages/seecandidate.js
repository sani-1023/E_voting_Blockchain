
import React from "react";
import styles from "../styles/Home.module.css";



export default class ElectionResultsPage extends React.Component {
    state = {
        loading: true,
        result:[],
    };

    async componentDidMount() {
        const url = "http://localhost:3000/seeCandidates/${election1}";
        const response = await fetch(url);
        const data = await response.json();

        console.log(data);

        this.setState({result:data})

    }

    render() {


        if (!this.state.result.length) {
            return <div className={styles.card2}>No Candidates found</div>;
        }

        return (
            <div>
                {this.state.result.map(r=>(
                    <div className={styles.card2} key={r.Key}>
                        <div>Candidate Name: {r.Record.name}</div>
                        <div>Sign:  {r.Record.sign}</div>
                        <div>Candidate Id:  {r.Record.canId}</div>
                    </div>


                ))

                }

            </div>
        );

    }
}
