import { DeleteOutlined } from "@ant-design/icons";
import { Carousel, Popconfirm } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./GymBox.less";

interface GymBoxProps {
  gymId: string;
  gymName: string;
  city: string;
  description: string;
  images: string[];
  onDelete: () => void;
}

const GymBox: React.FC<GymBoxProps> = ({
  gymId,
  gymName,
  city,
  description,
  images,
  onDelete,
}) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/gyms/${gymId}`);
  };
  return (
    <div className="gym-box">
      <div className="delete-button-wrapper">
        <Popconfirm
          title="Are you sure you want to delete this gym?"
          okText="Yes"
          cancelText="No"
          onConfirm={onDelete}
        >
          <DeleteOutlined className="gym-box-icon" />
        </Popconfirm>
      </div>

      <div className="gym-image-wrapper">
        <Carousel
          autoplay
          speed={500}
          arrows={images.length > 1}
          dots={images.length > 1}
        >
          {images.slice(0, 5).map((img, i) => (
            <div key={i}>
              <img src={img} alt={`gym-${i}`} className="gym-image" />
            </div>
          ))}
        </Carousel>
      </div>

      <div className="gym-info" onClick={handleNavigate}>
        <h3 className="gym-title">{gymName}</h3>
        <p className="gym-city">{city}</p>
        <p className="gym-description">
          {description.length > 120
            ? description.slice(0, 117) + "..."
            : description}
        </p>
      </div>
    </div>
  );
};

export default GymBox;
