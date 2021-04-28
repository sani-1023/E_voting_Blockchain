

////
import { Form, Input, InputNumber, Button } from 'antd';

import {useRouter} from "next/router";



export default function LogoutPage() {

    const router =  useRouter();

    async function logout()
    {
        const url = "http://localhost:3000/logOut"
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            withCredentials:true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        await router.push('/');
        //await logout();

    }

    return (
       <div></div>
    );
};



