import React, { useEffect } from "react";
import "./Login.less";
import type { FormProps } from "antd";
import { Layout, Button, Form, Input } from "antd";
const { Content } = Layout;
import { CLIENT_URL } from "../../constants/api-config";
import { login } from "../../api/auth";

const Home: React.FC = () => {
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);
  const [submittable, setSubmittable] = React.useState<boolean>(false);

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false));
  }, [form, values]);

  type FieldType = {
    username?: string;
    password?: string;
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    if (values.username && values.password) {
      try {
        const data = await login(values.username, values.password);
        console.log("Login successful:", data);
        // You can handle login success, store tokens, etc.
      } catch (error) {
        console.error("Login error:", error);
        // Handle error (e.g., show error message)
      }
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="login-page-container">
      <div className="login-page-content-container">
        <h1>Welcome back! Glad to see you, Again!</h1>
        <Content
          style={{
            margin: "0 auto",
            padding: "16px",
            maxWidth: "630px",
            width: "100%",
          }}
        >
          <Form
            form={form}
            name="basic"
            layout="vertical"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginTop: "2rem",
            }}
            labelCol={{ span: 124 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item<FieldType>
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input className="login-input" placeholder="Email" />
            </Form.Item>

            <Form.Item<FieldType>
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password className="login-input" placeholder="Password " />
            </Form.Item>

            <Form.Item style={{ marginTop: "3rem" }}>
              <Button
                style={{ margin: "auto", width: "100%" }}
                color="default"
                variant="solid"
                htmlType="submit"
                disabled={!submittable}
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        </Content>
        <div className="register-link">
          <span>
            Don’t have an account?{" "}
            <a href={`${CLIENT_URL}/register`}>Register Now</a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Home;
