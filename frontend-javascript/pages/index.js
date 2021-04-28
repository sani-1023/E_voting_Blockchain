import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {useRouter} from "next/router";

import {Button, Menu} from "antd";
import {DownloadOutlined, FontColorsOutlined, LoginOutlined, UserOutlined} from "@ant-design/icons";
import React from "react";


export default function Home() {

    const router = useRouter();

    return (
        <div className={styles.container}>
            <Head>
                <title>E-Voting </title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    Welcome to E-Voting
                </h1>

                <br/>
                <div className={styles.grid}>
                    <Button type="primary" icon={<UserOutlined />} className={styles.button1} onClick={()=> router.push('/register')}>
                        Register
                    </Button>



                    <Button type="primary" icon={<LoginOutlined />}  className={styles.button2} onClick={()=> router.push('/login')}>
                        LogIn
                    </Button>


                    <Button type="primary" icon={<FontColorsOutlined />}  className={styles.button3} onClick={()=> router.push('/admin')}>
                        Admin
                    </Button>
                </div>



            </main>

        </div>
    )
}
