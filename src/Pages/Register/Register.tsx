import React, { useState, useEffect } from "react";
import "./Register.less";
import type { FormProps } from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
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
} from "antd";
import { CLIENT_URL } from "../../constants/api-config";
import { register } from "../../api/auth";
const { Content } = Layout;
import { UploadChangeParam } from 'antd/es/upload/interface';
import { UploadFile } from 'antd/es/upload/interface';

const Register: React.FC = () => {
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);
  const [submittable, setSubmittable] = React.useState<boolean>(false);
  const [gymOwnerDocument, setGymOwnerDocument] = useState<UploadFile>();
  const [userProfilePicture, setUserProfilePicture] = useState<UploadFile>();

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
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    console.log("Register values:", values);
    if (
      values.firstname &&
      values.lastname &&
      values.email &&
      values.birthdate &&
      values.password &&
      values.city
    ) {
      //       // Assuming you want to add the file data into the values before submitting
      // const formData = new FormData();
      // formData.append('name', values.name);
      // formData.append('email', values.email);

      // // If a file is selected, append it to FormData
      // if (fileList.length > 0) {
      //   formData.append('file', fileList[0].originFileObj); // Only take the first file
      // }

      try {
        const data = await register(
          values.firstname,
          values.lastname,
          values.email,
          values.password,
          values.birthdate,
          values.city
        );
        console.log("Register successful:", data);
        // You can handle register success, store tokens, etc.
      } catch (error) {
        console.error("Register error:", error);
        // Handle error (e.g., show error message)
      }
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  // Handle file change, store the file in state
  const handleGymOwnerDocumentFileChange = (info:UploadChangeParam) => {
    if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
    setGymOwnerDocument(info.file);
  };

  const handleUserProfileFileChange = (info:UploadChangeParam) => {
    if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
    setUserProfilePicture(info.file);
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
                  {
                    required: true,
                    message: "Please input your firstname",
                  },
                ]}
              >
                <Input className="register-input" placeholder="First name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<FieldType>
                name="lastname"
                rules={[
                  {
                    required: true,
                    message: "Please input your lastname",
                  },
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
                  {
                    required: true,
                    message: "Please input your birthdate",
                  },
                ]}
              >
                <DatePicker
                  className="register-input"
                  format="YYYY-MM-DD"
                  allowClear
                  onChange={(date, dateString) => {
                    console.log(date, dateString);
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              {" "}
              <Form.Item<FieldType>
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password",
                  },
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
                rules={[
                  {
                    required: true,
                    message: "Please input your city",
                  },
                ]}
              >
                <Input className="register-input" placeholder="City" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item valuePropName="gymOwnerDocument">
                <Upload.Dragger
                  listType="picture"
                  beforeUpload={() => false}
                  onChange={handleGymOwnerDocumentFileChange}
                  fileList={gymOwnerDocument && [gymOwnerDocument]}
                  accept="image/*"
                >
                  <p className="ant-upload-drag-icon">
                    <UploadOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag file to this area to upload
                  </p>
                </Upload.Dragger>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item valuePropName="userProfilePicture">
                <Upload.Dragger
                  listType="picture"
                  beforeUpload={() => false} // Prevent auto-upload
                  onChange={handleUserProfileFileChange}
                  fileList={userProfilePicture && [userProfilePicture]}
                  accept="image/*"
                >
                  <p className="ant-upload-drag-icon">
                    <UserOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag file to this area to upload
                  </p>
                </Upload.Dragger>
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
          Already have an account? <a href={`${CLIENT_URL}/login`}>Login Now</a>
        </span>
      </div>
    </div>
  );
};

export default Register;
