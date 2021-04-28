import Sider from "antd/es/layout/Sider";
import {Layout, Menu} from "antd";
import {useRouter} from "next/router";
import {
    AppstoreOutlined,
    BarChartOutlined,
    CloudOutlined, FontColorsOutlined, LoginOutlined, LogoutOutlined, ShopOutlined, TeamOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined
} from "@ant-design/icons";

const {Sider} = Layout;


export default function LeftSideBar() {

    const router =  useRouter();

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

            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                <Menu.Item key="1" icon={<UserOutlined/>} onClick={()=> router.push('/register')}>
                    Register Voter
                </Menu.Item>
                <Menu.Item key="2" icon={<LoginOutlined/>}onClick={()=> router.push('/login')}>
                    Login
                </Menu.Item>
                <Menu.Item key="3" icon={<FontColorsOutlined />}onClick={()=> router.push('/admin')}>
                    Admin
                </Menu.Item>
                <Menu.Item key="4" icon={<BarChartOutlined/>}onClick={()=> router.push('/electionresults')}>
                    See Results
                </Menu.Item>

                <Menu.Item key="5" icon={<LogoutOutlined />}onClick={()=> router.push('/')}>
                    Log Out
                </Menu.Item>

            </Menu>
            
        </Sider>

     
    )
}