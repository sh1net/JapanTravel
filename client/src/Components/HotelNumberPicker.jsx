import React, { useState } from 'react';
import '../Styles/HotelNumberPicker.css';

const HotelNumberPicker = ({ selectedNumbers, onSelect, rooms, count }) => {
  const [selected, setSelected] = useState(selectedNumbers || []);

  const handleClick = (number) => {
    if (rooms && rooms.includes(number)) {
      let updatedSelection = [...selected];
      if (updatedSelection.includes(number)) {
        updatedSelection = updatedSelection.filter((n) => n !== number);
      } else {
        updatedSelection.push(number);
      }
      setSelected(updatedSelection);
      onSelect(updatedSelection);
    }
  };

  const renderNumbers = () => {
    const numbers = [];
    for (let i = 1; i <= 100; i++) {
      numbers.push(
        <div
          key={i}
          className={`hotel_number ${selected.includes(i) ? 'selected' : ''} ${rooms && rooms.includes(i) ? '' : 'disabled'}`}
          onClick={() => handleClick(i)}
        >
          {i}
        </div>
      );
    }
    return numbers;
  };

  return <div className="hotel_number_picker">{renderNumbers()}</div>;
};

export default HotelNumberPicker;
