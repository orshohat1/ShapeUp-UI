import React, { useEffect } from "react";
import "./Login.less";
import type { FormProps } from "antd";
import { Layout, Button, Form, Input } from "antd";
const { Content } = Layout;
import { CLIENT_URL } from "../../constants/api-config";
import { login } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../../context/useUserProfile";
import { getUserProfile } from "../../api/users";

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);
  const [submittable, setSubmittable] = React.useState<boolean>(false);
  const navigate = useNavigate();
  const { setUserProfile } = useUserProfile();

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
        const data = await login(values.email, values.password);
        console.log("Login successful:", data);
        console.log("Fetching user profile...");
        const userProfileData = await getUserProfile();

        const userProfile = {
          _id: userProfileData._id,
          avatarUrl: userProfileData.avatarUrl,
          birthdate: userProfileData.birthdate,
          email: userProfileData.email,
          favoriteGyms: userProfileData.favoriteGyms || [],
          firstName: userProfileData.firstName,
          gender: userProfileData.gender,
          lastName: userProfileData.lastName,
          role: userProfileData.role,
          id: userProfileData._id,
          street: userProfileData.street,
        }

        setUserProfile(userProfile);
        console.log("User profile fetched:", userProfileData);
        navigate("/dashboard");
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
      <div className="register-link">
        <span>
          Don’t have an account?{" "}
          <a href={`${CLIENT_URL}/register`}>Register Now</a>
        </span>
      </div>
    </div>
  );
};

export default Login;
