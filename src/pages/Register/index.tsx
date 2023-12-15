import { Navigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../Auth";
import { request } from "../../request";
import { AxiosError, isAxiosError } from "axios";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
export function Register() {
  const { user } = useAuth("Register");
  const location = useLocation();
  const origin = location.state?.from?.pathname || "/";
  if (user) {
    return <Navigate to={origin} />;
  }

  return <RegisterForm />;
}

export default function RegisterForm() {
  const [messageApi, contextHolder] = message.useMessage();
  const { updateUser } = useAuth("RegisterForm");

  const onFinish = async (data: { username: string; password: string }) => {
    try {
      const res = await request({
        method: "POST",
        url: "/auth/signup",
        data,
      });
      localStorage.setItem("access_token", res.data.accessToken);
      updateUser(res.data.user);
    } catch (e) {
      const error = e as Error | AxiosError;
      if (isAxiosError(error)) {
        const message = error.response?.data?.message;
        message && messageApi.error(message);
      }
    }
  };

  return (
    <>
      {contextHolder}
      <Form
        name="Register"
        className="Register-form w-[300px] mx-auto mt-44"
        initialValues={{ username: "", password: "" }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[
            { required: true, message: "请输入用户名" },
            { min: 3, message: "用户名不能少于3位" },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="用户名"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            { required: true, message: "请输入密码" },
            { min: 6, message: "用户名不能少于6位" },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="密码"
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="Register-form-button w-full"
          >
            注册
          </Button>
        </Form.Item>
        <Link to="/login">已有账号？去登陆</Link>
      </Form>
    </>
  );
}
