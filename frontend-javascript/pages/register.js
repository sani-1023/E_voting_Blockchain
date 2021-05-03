
////register
import { Form, Input, InputNumber, Button } from "antd";
import styles from "../styles/Home.module.css";
import Leftsidebarregister from "../components/Leftsidebarregister";


import { useRouter } from "next/router";

const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 12,
  },
};
/* eslint-disable no-template-curly-in-string */

const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};
/* eslint-enable no-template-curly-in-string */

export default function RegisterPage() {
  const router = useRouter();

  const onFinish = async (values) => {
    console.log(values);

    const { name, email, password } = values.user;

    const url = "http://localhost:3000/registerVoter";

    const requestBody = {
      name: name,
      email: email,
      password: password,
    };
    const response = await fetch(url, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      withCredentials: true,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(requestBody), // body data type must match "Content-Type" header
    });

    const data = await response.json();
    console.log(data);
    if ("error" in data) {
      alert("Registration failed...User already exists");
    } else {
      await router.push("/login");
    }
  };

  return (

    <div>  <Leftsidebarregister/> 
    <div className={styles.shadowbox5}>
      
      <Form
        {...layout}
        name="nest-messages"
        onFinish={onFinish}
        validateMessages={validateMessages}
      >
        <Form.Item
          name={["user", "name"]}
          label="Name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={["user", "email"]}
          label="Email"
          rules={[
            {
              type: "email",
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name={["user", "password"]}
          label="Password"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
          <button className={styles.button5} type="primary" htmltype="submit" >
            Register
          </button>
        </Form.Item>
      </Form>
    </div>

    </div>
  );
}
