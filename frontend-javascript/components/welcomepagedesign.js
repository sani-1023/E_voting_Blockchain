import { Button, Radio } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import {useRouter} from "next/router";

export default function welcomepagedesign(){

    const router =  useRouter();

    return (


                        <Button type="primary" icon={<DownloadOutlined />} size="large">
                            Download
                        </Button>





    )
}

