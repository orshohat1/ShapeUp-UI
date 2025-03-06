import React from 'react';
import { Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import './GymBox.less';

interface GymBoxProps {
  gymName: string;
  city: string;
  onEdit: () => void;
  onDelete: () => void;
  onUpdatePrices: () => void;
  onGeneratePricingSuggestions: () => void;
}

const GymBox: React.FC<GymBoxProps> = ({
  gymName,
  city,
  onEdit,
  onDelete,
  onUpdatePrices,
  onGeneratePricingSuggestions,
}) => {
  return (
    <div className="gym-box">
      <div className="gym-box-header">
        <h3>{gymName}</h3>
        <div className="gym-box-icons">
          <EditOutlined onClick={onEdit} className="gym-box-icon" />
          <DeleteOutlined onClick={onDelete} className="gym-box-icon" />
        </div>
      </div>
      <p>{city}</p>
      <Button type='primary' onClick={onUpdatePrices} className="gym-box-button">
        Update Prices
      </Button>
      <Button onClick={onGeneratePricingSuggestions} className="gym-box-button">
        Generate Pricing Suggestions
      </Button>
    </div>
  );
};

export default GymBox;
