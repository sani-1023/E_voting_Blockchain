import Head from 'next/head'
import styles from '../styles/Home.module.css'

/*export default function AdminPage() {
    return (
        <div>Admin Page</div>
    )
}*/

///////////////////////////////

import {Button, Form, Input, InputNumber} from 'antd';
import {useRouter} from "next/router";
const layout = {
    labelCol: {
        span: 4,
    },
    wrapperCol: {
        span: 16,
    },
};
/* eslint-disable no-template-curly-in-string */

const validateMessages = {
    required: '${label} is required!',
    types: {
        number: '${label} is not a valid number!',
    },
    number: {
        range: '${label} must be between ${min} and ${max}',
    },
};
/* eslint-enable no-template-curly-in-string */

export default function AdminPage() {
    const router = useRouter();
    const onFinish = async (values) => {
        console.log(values);

        const {username,password} = values.user;

        const url = "http://localhost:3000/admin"

        const requestBody = {

            username : username,
            password:password
        }
        const response = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            withCredentials: true,
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
            alert("  Admin Log in failed! wrong email or password");
        }
        else
        {
            await router.push('/addelection');
        }
    };

    return (

        <div className={styles.shadowbox1}>
        <Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>

            <Form.Item
                name={['user', 'username']}
                label="Username"

                rules={[
                    {
                        required: true,
                        message: 'Please input your username!',
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item name={['user', 'password']}
                       label="Password"

                       rules={

                           [

                               {
                                   //type:'string',
                                   required:true,
                                   message:"Pleasse input your password",
                               },
                           ]
                       }
            >
                <Input.Password />
            </Form.Item>

            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4}}>
                <Button type="primary" htmlType="submit" >
                    Log In
                </Button>
            </Form.Item>
        </Form>
        </div>
    );
};



