import "./LoadingOverlay.less";

const LoadingOverlay = () => {
  return (
    <div className="loading-overlay show">
      <div className="loading-dots">
        <span className="dot">.</span>
        <span className="dot">.</span>
        <span className="dot">.</span>
      </div>
    </div>
  );
};

export default LoadingOverlay;
