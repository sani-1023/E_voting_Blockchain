import 'antd/dist/antd.css';
import '../styles/globals.css'

import {Layout, Menu} from 'antd';
//import LeftSideBar from "../components/LeftsideBar";

const {Header, Content, Footer} = Layout;

function MyApp({Component, pageProps}) {

    return (

        <Content style={{margin: '1px 0px 0', overflow: 'initial'}}>
            <div className="site-layout-background" style={{padding: 2}}>

                <Component {...pageProps} />
            </div>
        </Content>
    )

}

export default MyApp


//////////////////////////////

