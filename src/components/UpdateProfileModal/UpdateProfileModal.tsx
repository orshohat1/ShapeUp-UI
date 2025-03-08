import React, { useEffect, useRef, useState } from "react";
import "./UpdateProfileModal.less";
import type { FormProps, UploadFile } from "antd";
import { UserOutlined } from "@ant-design/icons";
import {
  Modal,
  Layout,
  Button,
  Form,
  Input,
  Row,
  Col,
  Upload,
  message,
} from "antd";
import { updateProfile } from "../../api/users";
import { RcFile, UploadChangeParam } from "antd/es/upload/interface";
import { useUserProfile } from "../../context/useUserProfile";
const { Content } = Layout;

interface UpdateProfileModalProps {
  open: boolean;
  onClose: () => void;
}

const UpdateProfileModal: React.FC<UpdateProfileModalProps> = ({
  open,
  onClose,
}) => {
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);
  const [submittable, setSubmittable] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const avatarFileRef = useRef<RcFile | null>(null);
  const { userProfile, refreshUserProfile } = useUserProfile();

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false));
  }, [form, values]);

  useEffect(() => {
  }, [userProfile]);

  useEffect(() => {
    if (userProfile?.avatarUrl) {
      setFileList([
        {
          uid: "-1",
          name: "",
          status: "done",
          url: userProfile.avatarUrl,
        },
      ]);
    }
  }, [userProfile?.avatarUrl]);

  useEffect(() => {
    form.setFieldsValue({ avatar: userProfile?.avatarUrl });
  }, [form, userProfile?.avatarUrl]);

  type FieldType = {
    firstname?: string;
    lastname?: string;
    city?: string;
    street?: string;
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    if (!userProfile?.id) {
      message.error("User ID not found");
      return;
    }

    await form.validateFields();

    if (values.firstname && values.lastname && values.city && values.street) {
      let newAvatar = null;
      if (avatarFileRef.current) {
        newAvatar = avatarFileRef.current;
      }

      try {
        await updateProfile(
          userProfile?.id,
          values.firstname,
          values.lastname,
          values.city,
          values.street,
          newAvatar
        );
        refreshUserProfile();
        message.success("Profile updated successfully");
      } catch (error: any) {
        const errorMsg = error?.response?.data?.message || error?.message;
        message.error("Profile update failed: " + errorMsg);
      }
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Registration failed:", errorInfo);
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
    }
    return false; // Prevent auto-upload
  };

  const onChange = (info: UploadChangeParam) => {
    const newFileList = info.fileList.slice(-1); // Ensure only 1 file
    setFileList(newFileList);
    form.setFieldsValue({ avatar: newFileList });

    if (newFileList.length === 0) {
      avatarFileRef.current = null;
    } else if (newFileList[0].originFileObj) {
      avatarFileRef.current = newFileList[0].originFileObj;
    }
  };

  return (
    <Modal
      title="Update Profile"
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={800}
    >
      <Content
        style={{
          margin: "0 auto",
          maxWidth: "1400px",
          width: "100%",
        }}
      >
        <Form
          form={form}
          name="basic"
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "2rem",
          }}
          initialValues={{
            firstname: userProfile?.firstName,
            lastname: userProfile?.lastName,
            city: userProfile?.city,
            street: userProfile?.street,
          }}
          labelCol={{ span: 124 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <div style={{ padding: 20 }}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Row gutter={[0, 6]}>
                  <Col span={24}>
                    <Form.Item<FieldType>
                      name="firstname"
                      rules={[
                        {
                          required: true,
                          message: "Please input your firstname",
                        },
                      ]}
                    >
                      <Input
                        className="register-input update-profile-input"
                        placeholder="First name"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item<FieldType>
                      name="lastname"
                      rules={[
                        {
                          required: true,
                          message: "Please input your lastname",
                        },
                      ]}
                    >
                      <Input
                        className="register-input update-profile-input"
                        placeholder="Last name"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item<FieldType>
                      name="city"
                      rules={[
                        {
                          required: true,
                          message: "Please input your city",
                        },
                      ]}
                    >
                      <Input
                        className="register-input update-profile-input"
                        placeholder="City"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      name="street"
                      rules={[
                        { required: true, message: "Please input your street" },
                      ]}
                    >
                      <Input
                        className="register-input update-profile-input"
                        placeholder="Street"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>

              <Col
                span={12}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Form.Item
                  name="avatar"
                  valuePropName="avatar"
                  rules={[
                    {
                      required: true,
                      validator: () =>
                        fileList.length > 0
                          ? Promise.resolve()
                          : Promise.reject(
                              new Error("Please upload an image!")
                            ),
                    },
                  ]}
                >
                  <Upload.Dragger
                    accept="image/*"
                    listType="picture"
                    fileList={fileList} // Bind fileList to state
                    beforeUpload={beforeUpload}
                    onChange={onChange}
                    maxCount={1}
                  >
                    <p className="ant-upload-drag-icon">
                      <UserOutlined />
                    </p>
                    <p className="ant-upload-text">
                      Click or drag avatar file to this area
                    </p>
                  </Upload.Dragger>
                </Form.Item>
              </Col>
            </Row>
          </div>

          <Form.Item style={{ marginTop: "3rem" }}>
            <Button
              style={{ margin: "auto", width: "100%" }}
              color="default"
              variant="solid"
              htmlType="submit"
              disabled={!submittable}
            >
              Save
            </Button>
          </Form.Item>
        </Form>
      </Content>
    </Modal>
  );
};

export default UpdateProfileModal;
