//import Sider from "antd/es/layout/Sider";
//Leftsidebarstopelection.js
import {Layout, Menu} from "antd";
import {useRouter} from "next/router";
import {
    AppstoreOutlined, AuditOutlined,
    BarChartOutlined, ClockCircleOutlined,
    CloudOutlined,
    FontColorsOutlined,
    LoginOutlined,
    LogoutOutlined,
    ShopOutlined,
    SolutionOutlined, StopFilled,
    StopOutlined,
    TeamOutlined,
    UploadOutlined, UserAddOutlined,
    UserOutlined,
    VideoCameraOutlined
} from "@ant-design/icons";

const {Sider} = Layout;


export default function LeftSideBarStopElection() {

    const router =  useRouter();

    async function logout() {
        // console.log("logout started");

        await fetch("http://localhost:3000/adminLogOut", {
            method: "GET",
            withCredentials: true,
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        await router.push("/");
    }
    ///


    return (
        <Sider
            style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
            }}
        >
            <div className="logo"/>
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['5']}>
                <Menu.Item key="1" icon={<AuditOutlined  />} onClick={()=> router.push('/addelection')}>
                    Add election
                </Menu.Item>

                <Menu.Item key="2" icon={<UserAddOutlined /> } onClick={()=> router.push('/addcandidate')}>
                    Add candidate
                </Menu.Item>

                <Menu.Item key="3" icon={<ClockCircleOutlined /> } onClick={()=> router.push('/runningelection')}>
                    Running Election
                </Menu.Item>

                <Menu.Item key="4" icon={<BarChartOutlined/>}onClick={()=> router.push('/electionresults')}>
                    See Results
                </Menu.Item>

                <Menu.Item key="5" icon={<StopFilled/>}onClick={()=> router.push('/stopelection')}>
                    Stop Election
                </Menu.Item>

                <Menu.Item key="6" icon={<LogoutOutlined />}onClick={() => logout()} >

                    Log Out
                </Menu.Item>

            </Menu>
        </Sider>
    )
}