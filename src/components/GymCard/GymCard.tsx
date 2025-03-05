import React from "react";
import { HeartOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import "./GymCard.less";

interface GymCardProps {
  gymName: string;
  city: string;
  rating: number;
  reviews: number;
  pricing: Record<string, string>;
  images: string[];
}

const GymCard: React.FC<GymCardProps> = ({ gymName, city, rating, reviews, pricing, images }) => {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="gym-card">
      <div className="gym-header">
        <h3>{gymName}</h3>
        <HeartOutlined className="favorite-icon" />
      </div>
      <p className="gym-location">Location: {city}</p>
      <p className="gym-rating">Rating: {rating} ⭐ ({reviews} reviews)</p>
      
      <p className="gym-pricing-title">Pricing:</p>
      <ul className="gym-pricing">
        {Object.entries(pricing).map(([key, value]) => (
          <li key={key}>{key}: {value}</li>
        ))}
      </ul>

      <div className="gym-image-slider">
        <LeftOutlined onClick={handlePrev} className="slider-arrow" />
        <img src={images[currentImageIndex]} alt="Gym" className="gym-image" />
        <RightOutlined onClick={handleNext} className="slider-arrow" />
      </div>
    </div>
  );
};

export default GymCard;
