import React, { useEffect, useState } from "react";
import { getGymReviews, addReview } from "../../api/reviews";
import { List, Rate, Modal, Avatar, Button, Input, Form, notification, Pagination } from "antd";
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
  onReviewAdded: (gymId: string) => void;
  onReviewsClick?: () => void;
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
  onReviewAdded,
  onReviewsClick,
}) => {
  const [reviews, setReviews] = useState([] as any[]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [localReviewsCount, setLocalReviewsCount] = useState(reviewsCount);
  const [averageRating, setAverageRating] = useState(parseFloat(rating) || 0);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const fetchedReviews = await getGymReviews(gymId);
        setReviews(fetchedReviews);

        setLocalReviewsCount(fetchedReviews.length);
        if (fetchedReviews.length > 0) {
          const totalRating = fetchedReviews.reduce((sum, review) => sum + review.rating, 0);
          setAverageRating(parseFloat((totalRating / fetchedReviews.length).toFixed(1)));
        } else {
          setAverageRating(0);
        }
      } catch (error) {
        console.error("Failed to load reviews", error);
      }
    };

    fetchReviews();
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

      setLocalReviewsCount((prev) => prev + 1);
      setIsReviewFormOpen(false);

      // Update the reviews state with the new review
      const updatedReviews = [...reviews, { rating: values.rating, content: values.content, user: { firstName: "You" } }];
      setReviews(updatedReviews);

      const totalRating = updatedReviews.reduce((sum, review) => sum + review.rating, 0);
      const newAverageRating = (totalRating / updatedReviews.length).toFixed(1);
      setAverageRating(parseFloat(newAverageRating));

      onReviewAdded(gymId);
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
        ⭐ {localReviewsCount > 0 ? averageRating : "No reviews yet"} (
        <span
          onClick={localReviewsCount > 0 ? () => setIsModalOpen(true) : undefined} >
          {localReviewsCount} {localReviewsCount === 1 ? "review" : "reviews"}
        </span>
        )
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
        {reviews.length > 0 ? (
          <>
            <List
              dataSource={reviews.slice((currentPage - 1) * reviewsPerPage, currentPage * reviewsPerPage)}
              renderItem={(review: any) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={review.user?.avatarUrl || "/default-avatar.png"} />}
                    title={<b>{review.user?.firstName || "Anonymous User"}</b>}
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
            {/* Pagination for Reviews */}
            <Pagination
              current={currentPage}
              total={reviews.length}
              pageSize={reviewsPerPage}
              onChange={(page) => setCurrentPage(page)}
              className="reviews-pagination"
            />
          </>
        ) : (
          <p>No reviews yet!</p>
        )}
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
