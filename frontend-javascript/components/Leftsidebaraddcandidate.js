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


export default function LeftSideBarAddcandidate() {

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
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['3']}>
                <Menu.Item key="1" icon={<SolutionOutlined />} onClick={()=> router.push('/addelection')}>
                    Add election
                </Menu.Item>

                <Menu.Item key="2" icon={<BarChartOutlined/>}onClick={()=> router.push('/electionresults')}>
                    See Results
                </Menu.Item>

                <Menu.Item key="3" icon={<LogoutOutlined />}onClick={()=> router.push('/')}>
                    Admin Log Out
                </Menu.Item>

            </Menu>
        </Sider>
    )
}