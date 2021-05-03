
//addcandidate
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import LeftSideBarAddCandidate from "../components/Leftsidebaraddcandidate";
import React, { useState } from 'react';
import { Form, Input, Button, Radio } from 'antd';
import {useRouter} from "next/router";
import {CheckCircleFilled, UserOutlined} from "@ant-design/icons";


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

export default function AddCandidatePage() {

    const router =  useRouter();

    const onFinish = async (values) => {
        console.log(values);

        const {canId,name,sign,electionId} = values.user;

        const url = "http://localhost:3000/addCandidate"

        const requestBody = {
            canId: canId,
            name: name,
            sign:sign,
            electionId:electionId
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
            alert("candidate successfully created")
            document.getElementById('nest-messages').reset();
            //await router.push('/addcandidate');
        }

    };


    return (
        <>
            <LeftSideBarAddCandidate/>
            <div className={styles.shadowbox5}>

                <Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>

                    <Form.Item
                        name={['user', 'canId']}
                        label="Candidate Id"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>


                    <Form.Item
                        name={['user', 'name']}
                        label="Candidate Name"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>


                    <Form.Item
                        name={['user', 'sign']}
                        label="Sign of Candidate"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        name={['user', 'electionId']}
                        label="Election Id"
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
                    <Form.Item wrapperCol={{...layout.wrapperCol, offset: 18}}>
                        <div className={styles.shift1}>
                        <Button type="primary" icon={<CheckCircleFilled />} className={styles.button1} onClick={()=> router.push('/stopelection')}>
                            Complete
                        </Button>
                        </div>
                    </Form.Item>
                </Form>


            </div>
        </>
    );
};



