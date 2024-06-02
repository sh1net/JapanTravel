import React, { useState } from 'react';
import '../Styles/HotelNumberPicker.css';

const HotelNumberPicker = ({ selectedNumbers, onSelect, rooms, count }) => {
  const [selected, setSelected] = useState(selectedNumbers || []);

  const arraysEqual = (a, b) => {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  };

  const handleClick = (number) => {
    if (rooms && rooms.some((room) => arraysEqual(room, number))) {
      let updatedSelection = [...selected];
      const index = updatedSelection.findIndex((n) => arraysEqual(n, number));

      if (index > -1) {
        updatedSelection.splice(index, 1);
      } else {
        updatedSelection.push(number);
      }

      setSelected(updatedSelection);
      onSelect(updatedSelection);
    }
  };

  const renderNumbers = () => {
    return rooms.map((room, index) => {
      const isSelected = selected.some((selectedRoom) => arraysEqual(selectedRoom, room));
      const isAvailable = rooms.some((availableRoom) => arraysEqual(availableRoom, room));

      return (
        <div
          key={index}
          className={`hotel_number ${isSelected ? 'selected' : ''} ${isAvailable ? '' : 'disabled'}`}
          onClick={() => isAvailable && handleClick(room)}
        >
          {room[0]}-{room[1]}
        </div>
      );
    });
  };

  return <div className="hotel_number_picker">{renderNumbers()}</div>;
};

export default HotelNumberPicker;
