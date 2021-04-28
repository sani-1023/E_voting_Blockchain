

////
import { Form, Input, InputNumber, Button } from 'antd';

import {useRouter} from "next/router";
import Leftsidebarsubmitelectionid from "../components/Leftsidebarsubmitelectionid";
import styles from "../styles/Home.module.css";
const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 10,
    },
};
/* eslint-disable no-template-curly-in-string */

const validateMessages = {
    required: '${label} is required!',
    types: {
        email: '${label} is not a valid email!',
        number: '${label} is not a valid number!',
    },
    number: {
        range: '${label} must be between ${min} and ${max}',
    },
};
/* eslint-enable no-template-curly-in-string */

export default function castVotePage() {

    const router =  useRouter();

    const onFinish = async (values) => {
        console.log(values);

        const {electionId,candidateId} = values.user;

        const url = "http://localhost:3000/castVote"

        const requestBody = {
            electionId: electionId,
            candidateId: candidateId
        }
        const response = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            withCredentials:true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(requestBody) // body data type must match "Content-Type" header
        });

        const data = await response.json();
        console.log(data);
        if('error' in data)
        {
            alert("Cast vote is failed or you have already voted");
        }
        else
        {
            alert('Your vote has been cast');
            await router.push('/electionresults');
        }


    };

    return (

   <>

            <Leftsidebarsubmitelectionid/>

       <div className={styles.shadowbox1}>

           <Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>


               <Form.Item
                   name={['user', 'electionId']}
                   label="Enter election Id"
                   rules={[
                       {
                           required: true,
                       },
                   ]}
               >
                   <Input />
               </Form.Item>
               <Form.Item
                   name={['user', 'candidateId']}
                   label="Enter Candidate Id"
                   rules={[
                       {

                           required: true,
                       },
                   ]}
               >
                   <Input />
               </Form.Item>



               <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8}}>
                   <Button type="primary" htmlType="submit">
                       Cast Vote
                   </Button>
               </Form.Item>
           </Form>

       </div>

    </>
    );
};



