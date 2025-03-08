import React, { useEffect, useState } from "react";
import { getGymReviews, addReview } from "../../api/reviews";
import { List, Rate, Modal, Avatar, Button, Input, Form, notification } from "antd";
import { HeartFilled, HeartOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import "./GymCard.less";

interface GymCardProps {
  gymId: string;
  gymName: string;
  city: string;
  rating: string;
  reviewsCount: number;
  images: string[];
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const GymCard: React.FC<GymCardProps> = ({
  gymId,
  gymName,
  city,
  rating,
  reviewsCount,
  images,
  isFavorite,
  onToggleFavorite,
}) => {
  const [reviews, setReviews] = useState([] as any[]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);

  useEffect(() => {
    if (reviewsCount > 0) {
      const fetchReviews = async () => {
        try {
          const fetchedReviews = await getGymReviews(gymId);
          setReviews(fetchedReviews);
        } catch (error) {
          console.error("Failed to load reviews", error);
        }
      };
      fetchReviews();
    }
  }, [gymId, reviewsCount]);

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleAddReview = async (values: { rating: number; content: string }) => {
    try {
      await addReview(gymId, values.rating, values.content);
      notification.success({ message: "Review added successfully!" });
      setIsReviewFormOpen(false);
    } catch (error) {
      notification.error({ message: "Failed to add review. Please try again." });
    }
  };

  return (
    <div className="gym-card">
      <div className="gym-header">
        <h3>{gymName}</h3>
        {isFavorite ? (
          <HeartFilled className="favorite-icon active" onClick={onToggleFavorite} />
        ) : (
          <HeartOutlined className="favorite-icon" onClick={onToggleFavorite} />
        )}
      </div>
      <p className="gym-location">📍 {city}</p>
      <p className="gym-rating">
        ⭐ {rating} {" "}
        <span
          style={{ cursor: reviewsCount > 0 ? "pointer" : "default" }}
          onClick={reviewsCount > 0 ? () => setIsModalOpen(true) : undefined}
        >
          (<span style={{ textDecoration: reviewsCount > 0 ? "underline" : "none", color: "inherit" }}>
            {reviewsCount}
          </span>{" "}
          reviews)
        </span>
      </p>
      <Button className="add-review-btn" type="primary" size="small" onClick={() => setIsReviewFormOpen(true)}>
        Add Review
      </Button>

      {/* Image Slider */}
      <div className="gym-image-slider">
        <LeftOutlined onClick={handlePrev} className="slider-arrow" />
        <img src={images[currentImageIndex]} alt="Gym" className="gym-image" />
        <RightOutlined onClick={handleNext} className="slider-arrow" />
      </div>

      {/* Reviews Modal */}
      <Modal
        title={`Reviews for ${gymName}`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <List
          dataSource={reviews}
          renderItem={(review: any) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={review.user?.avatarUrl || "/default-avatar.png"} />}
                title={<b>{review.user?.name || "Anonymous User"}</b>}
                description={
                  <>
                    <Rate disabled defaultValue={review.rating} />
                    <p>{review.content}</p>
                  </>
                }
              />
            </List.Item>
          )}
        />
      </Modal>

      {/* Add Review Modal */}
      <Modal
        title="Add Review"
        open={isReviewFormOpen}
        onCancel={() => setIsReviewFormOpen(false)}
        footer={null}
      >
        <Form onFinish={handleAddReview} layout="vertical">
          <Form.Item name="rating" label="Rating" rules={[{ required: true, message: "Please rate the gym" }]}>
            <Rate />
          </Form.Item>
          <Form.Item name="content" label="Review" rules={[{ required: true, message: "Please enter your review" }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit Review
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GymCard;
