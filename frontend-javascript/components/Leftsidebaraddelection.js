//import Sider from "antd/es/layout/Sider";
import {Layout, Menu} from "antd";
import {useRouter} from "next/router";
import {
    AppstoreOutlined,
    BarChartOutlined,
    CloudOutlined,
    FontColorsOutlined,
    LoginOutlined,
    LogoutOutlined,
    ShopOutlined,
    SolutionOutlined,
    StopOutlined,
    TeamOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined
} from "@ant-design/icons";

const {Sider} = Layout;


export default function LeftSideBarAddElection() {

    const router =  useRouter();

    return (
        <Sider
            style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                width:'20vh',
                left: 0,
            }}
        >
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>

                <Menu.Item key="1" icon={<StopOutlined/>} onClick={()=> router.push('/stopelection')}>
                    Stop election
                </Menu.Item>
                <Menu.Item key="2" icon={<BarChartOutlined/>}onClick={()=> router.push('/electionresults')}>
                    See Results
                </Menu.Item>

                <Menu.Item key="3" icon={<LogoutOutlined />}onClick={()=> router.push('/')}>
                    Log Out
                </Menu.Item>

            </Menu>
        </Sider>
    )
}