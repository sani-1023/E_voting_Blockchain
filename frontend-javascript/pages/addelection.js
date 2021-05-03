//addelection

import styles from '../styles/Home.module.css'
import LeftSideBarAddElection from "../components/Leftsidebaraddelection";
import React, { useState } from 'react';
import { Form, Input, Button, Radio } from 'antd';
import {useRouter} from "next/router";


const layout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 12,
    },
};
const validateMessages = {
    required: '${label} is required!',

    number: {
        range: '${label} must be between ${min} and ${max}',
    },
};

export default function AddElectionPage() {

        const router =  useRouter();

        const onFinish = async (values) => {
            console.log(values);

            const {electionId,electionName,candidateNumber} = values.user;

            const url = "http://localhost:3000/addElection"

            const requestBody = {
                electionId: electionId,
                electionName: electionName,
                candidateNumber:candidateNumber
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
                alert("add election failed");
            }
            else
            {
                await router.push('/addcandidate');
            }

    };
    return (
        <>
            <LeftSideBarAddElection/>
            <div className={styles.shadowbox5}>

                <Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>

                    <Form.Item
                        name={['user', 'electionId']}
                        label="ElectionId"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>


                    <Form.Item
                        name={['user', 'electionName']}
                        label="Election Name"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>


                    <Form.Item
                        name={['user', 'candidateNumber']}
                        label="Number of Candidate"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item wrapperCol={{...layout.wrapperCol, offset: 6}}>
                        <button className={styles.button5} type="primary" htmltype="submit" >
                            Submit
                        </button>
                    </Form.Item>
                </Form>


            </div>
        </>
    );
};




