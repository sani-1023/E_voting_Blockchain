import Head from 'next/head'
import styles from '../styles/Home.module.css'
import LeftSideBarStopElection from "../components/Leftsidebarstopelection";
import React, { useState } from 'react';
import { Form, Input, Button, Radio } from 'antd';
import {useRouter} from "next/router";
import { json } from 'body-parser';


const layout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 10,
    },
};
const validateMessages = {
    required: '${label} is required!',

    number: {
        range: '${label} must be between ${min} and ${max}',
    },
};

export default function StopElectionPage() {

    const router =  useRouter();

    const onFinish = async (values) => {
        console.log(values);

        const {electionId} = values.user;

        const url = "http://localhost:3000/stopElection"

        const requestBody = {
            electionId: electionId,
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

        const data = await response.text();
        let comp = "The election is stoppped and result is ready!"
        console.log(data);
        if(comp === data)
        {
            alert("election has been stopped");
            await router.push('/electionresults');
        }
        else
        {
            alert("stop election failed");
        }




    };
    return (
        <>
            <LeftSideBarStopElection/>
            <div className={styles.shadowbox1}>

                <Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>

                    <Form.Item
                        name={['user', 'electionId']}
                        label="Input ElectionId to Stop"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item wrapperCol={{...layout.wrapperCol, offset: 6}}>
                        <Button type="primary" htmlType="submit" >
                            STOP
                        </Button>
                    </Form.Item>
                </Form>


            </div>
        </>
    );
};



