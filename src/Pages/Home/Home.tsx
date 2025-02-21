import "./Home.less";
import shapeUpLogo from "../../assets/Logo/shape-up.png";
import { Button, Flex } from "antd";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="full-page home-page-container">
      <div className="home-logo-container">
        <img src={shapeUpLogo} alt="logo" />
      </div>
      <Flex
        className="full-page home-button-container"
        vertical
        gap="small"
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Link to="/login">
          <Button color="default" variant="solid" block>
            Login Gym owner 
          </Button>
        </Link>
        <Link to="/user/login" >
          <Button color="default" variant="outlined" block>
            Login User
          </Button>
        </Link>
      </Flex>
    </div>
  );
};

export default Home;
