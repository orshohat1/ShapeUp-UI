import React, { useEffect } from "react";
import "./LoginAdmin.less";
import type { FormProps } from "antd";
import { Layout, Button, Form, Input, notification } from "antd";
import { login } from "../../../api/auth";
import { useUserProfile } from "../../../context/useUserProfile";
import { useNavigate } from "react-router-dom";
import { IUserType } from "../../../constants/enum/IUserType";
const { Content } = Layout;

const LoginAdmin: React.FC = () => {
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);
  const [submittable, setSubmittable] = React.useState<boolean>(false);
  const { refreshUserProfile } = useUserProfile();
  const navigate = useNavigate();

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false));
  }, [form, values]);

  type FieldType = {
    email?: string;
    password?: string;
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    if (values.email && values.password) {
      try {
        await login(values.email, values.password);
        const userProfile = await refreshUserProfile();
        if (userProfile && userProfile.role !== IUserType.ADMIN) {
          notification.warning({
            message: "Unauthorized",
            description: "This page is only for admins.",
            placement: "top",
          });
          return;
        }

        navigate("/admin/dashboard");
      } catch (error) {
        console.error("Login error:", error);
      }
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Login failed:", errorInfo);
  };

  return (
    <div className="full-page login-page-container">
      <h1>Welcome back! Glad to see you, again!</h1>
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
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please input your email",
              },
            ]}
          >
            <Input className="login-input" type="email" placeholder="Email" />
          </Form.Item>

          <Form.Item<FieldType>
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password",
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
    </div>
  );
};

export default LoginAdmin;
