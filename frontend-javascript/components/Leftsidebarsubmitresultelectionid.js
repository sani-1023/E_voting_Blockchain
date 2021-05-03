
//Leftsidebarsubmitelectionid.js
import {Layout, Menu} from "antd";
import {useRouter} from "next/router";
import {
    AppstoreOutlined,
    BarChartOutlined, ClockCircleOutlined,
    CloudOutlined,
    FontColorsOutlined,
    LoginOutlined,
    LogoutOutlined,
    ShopOutlined,
    SolutionOutlined,
    TeamOutlined,
    UnorderedListOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined
} from "@ant-design/icons";

const {Sider} = Layout;


export default function Leftsidebarsubmitelectionid() {

    const router =  useRouter();

    async function logout() {
        // console.log("logout started");

        await fetch("http://localhost:3000/logOut", {
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
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['3']}>
                <Menu.Item key="1" icon={<SolutionOutlined />} onClick={()=> router.push('/castvote')}>
                    CastVote
                </Menu.Item>

                <Menu.Item key="2" icon={<ClockCircleOutlined /> } onClick={()=> router.push('/runningelection')}>
                    Running Election
                </Menu.Item>

                <Menu.Item key="3" icon={<BarChartOutlined/>}onClick={()=> router.push('/submitresultelectionid')}>
                    See Results
                </Menu.Item>

                <Menu.Item key="4" icon={<UnorderedListOutlined />}onClick={()=> router.push('/submitelectionid')}>
                    See Candidates
                </Menu.Item>


                <Menu.Item key="5" icon={<LogoutOutlined />}onClick={() => logout()} >

                    Log Out
                </Menu.Item>


            </Menu>
        </Sider>
    )
}