import Head from 'next/head'
import styles from '../styles/Home.module.css'
import LeftSideBarSubmitElectionId from "../components/Leftsidebarsubmitelectionid";
import React, { useState } from 'react';
import { Form, Input, Button, Radio } from 'antd';
import {useRouter} from "next/router";


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

export default function SubmitElectionIdPage() {

    const router = useRouter();

    const onFinish = async (values) => {
        console.log(values);

        const { electionId } = values.param;


        const requestBody = {
            electionId:electionId
        };

        await router.push("/seecandidate/:");

    };
        return (
            <>
                <LeftSideBarSubmitElectionId/>
                <div className={styles.shadowbox}>

                    <Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>

                        <Form.Item
                            name={['param', 'electionId']}
                            label="ElectionId"
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
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>


                </div>
            </>
        );
    };



