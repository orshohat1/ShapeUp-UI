import { Link } from "react-router-dom";
import { Button } from "antd";
import { FireOutlined } from "@ant-design/icons";

const NotFound = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        padding: "0 20px",
      }}
    >
      <FireOutlined style={{ fontSize: "80px", color: "#fa541c", marginBottom: "20px" }} />
      <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>404 - Page Not Found</h1>
      <p style={{ fontSize: "20px", marginBottom: "30px" }}>
        Oops! Looks like you missed your workout and ended up here. Let's get you back on track!
      </p>
      <Link to="/">
        <Button type="primary" size="large">
          Back to Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
