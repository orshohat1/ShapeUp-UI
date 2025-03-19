import React, { useEffect, useRef } from "react";
import "./RegisterUser.less";
import type { FormProps } from "antd";
import dayjs from "dayjs";
import { useNavigate, Link } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import {
  Layout,
  Button,
  Form,
  Input,
  Row,
  Col,
  DatePicker,
  Upload,
  message,
  Select,
} from "antd";
import { RcFile, UploadChangeParam } from "antd/es/upload/interface";
import { register } from "../../../api/auth";
import { useUserProfile } from "../../../context/useUserProfile";
const { Content } = Layout;

const RegisterUser: React.FC = () => {
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);
  const [submittable, setSubmittable] = React.useState<boolean>(false);
  const avatarFileRef = useRef(null);
  const navigate = useNavigate();
  const { refreshUserProfile } = useUserProfile();

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false));
  }, [form, values]);

  type FieldType = {
    firstname?: string;
    lastname?: string;
    email?: string;
    birthdate?: Date;
    password?: string;
    city?: string;
    street?: string;
    gender?: string;
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const avatarFile = avatarFileRef.current;
    if (!avatarFile) {
      message.error("No avatar file selected");
      return;
    }

    if (
      values.firstname &&
      values.lastname &&
      values.email &&
      values.birthdate &&
      values.password &&
      values.city &&
      values.street &&
      values.gender
    ) {
      try {
        const data = await register(
          values.firstname,
          values.lastname,
          values.email,
          values.password,
          values.birthdate,
          values.city,
          values.street,
          values.gender,
          avatarFile
        );
        refreshUserProfile();
        message.success("Registration successful");
        navigate("/gyms");
      } catch (error: any) {
        const errorMsg = error?.response?.data?.message || error?.message;
        message.error("Registration failed: " + errorMsg);
      }
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Registration failed:", errorInfo);
  };

  const onChange = (
    info: UploadChangeParam,
    fileRef: React.MutableRefObject<RcFile | null>
  ) => {
    if (info.fileList.length === 0) {
      fileRef.current = null;
    } else {
      if (info.fileList[0].originFileObj) {
        fileRef.current = info.fileList[0].originFileObj;
      }
    }
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
    }
    return false;
  };

  return (
    <div className="full-page login-page-container">
      <h1>Hello! Register to get started</h1>
      <Content
        style={{
          margin: "0 auto",
          padding: "16px",
          maxWidth: "800px",
          width: "100%",
        }}
      >
        <Form
          form={form}
          name="basic"
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
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item<FieldType>
                name="firstname"
                rules={[
                  { required: true, message: "Please input your firstname" },
                ]}
              >
                <Input className="register-input" placeholder="First name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<FieldType>
                name="lastname"
                rules={[
                  { required: true, message: "Please input your lastname" },
                ]}
              >
                <Input className="register-input" placeholder="Last name" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item<FieldType>
                name="email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Please input a valid email",
                  },
                ]}
              >
                <Input
                  className="register-input"
                  type="email"
                  placeholder="Email"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<FieldType>
                name="birthdate"
                rules={[
                  { required: true, message: "Please input your birthdate" },
                ]}
              >
                <DatePicker
                  className="register-input"
                  format="DD-MM-YYYY"
                  allowClear
                  disabledDate={(current) =>
                    current && current.isAfter(dayjs())
                  }
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item<FieldType>
                name="password"
                rules={[
                  { required: true, message: "Please input your password" },
                ]}
              >
                <Input.Password
                  className="register-input"
                  placeholder="Password"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<FieldType>
                name="city"
                rules={[{ required: true, message: "Please input your city" }]}
              >
                <Input className="register-input" placeholder="City" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="street"
                rules={[
                  { required: true, message: "Please input your street" },
                ]}
              >
                <Input className="register-input" placeholder="Street" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="gender"
                rules={[
                  { required: true, message: "Please select your gender" },
                ]}
              >
                <Select className="register-input" placeholder="Select Gender">
                  <Select.Option value="male">Male</Select.Option>
                  <Select.Option value="female">Female</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item valuePropName="avatar">
                <div className="upload-container">
                  <Upload.Dragger
                    accept="image/*"
                    listType="picture"
                    beforeUpload={beforeUpload}
                    onChange={(info) => onChange(info, avatarFileRef)}
                    maxCount={1}
                  >
                    <p className="ant-upload-drag-icon">
                      <UserOutlined />
                    </p>
                    <p className="ant-upload-text">
                      Upload avatar profile image here
                    </p>
                  </Upload.Dragger>
                </div>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item style={{ marginTop: "3rem" }}>
            <Button
              style={{ margin: "auto", width: "100%" }}
              color="default"
              variant="solid"
              htmlType="submit"
              disabled={!submittable}
            >
              Register
            </Button>
          </Form.Item>
        </Form>
      </Content>
      <div className="register-link">
        <span>
          Already have an account?{" "}
          <Link to="/user/login">Login Now</Link>
        </span>
      </div>
    </div>
  );
};

export default RegisterUser;
