import React from 'react';
import './Services.css'; // Убедитесь, что импортируете ваш CSS-файл

function Services() {
  return (
    <div className="services-container">
      <h2 className="service_h">Наши сервисы</h2>
      <div className="service_container_container">
      <div className="service-item">
        <h3>Самые горячие туры</h3>
        <span>Посмотрите наши самые горячие туры, по самым жарким ценам. Самые шикарные номера в отелях, самые умные гиды, самые прекрасные виды. И это все только у нас!</span>
      </div>
      <div className="service-item">
        <h3>Поддержка</h3>
        <span>Появились вопросы? Обратитесь в службу поддержки, которая работает 24 часа</span>
      </div>
      <div className="service-item">
        <h3>Настройте профиль</h3>
        <span>До сих пор не настроили свой профиль? Вперед!</span>
      </div>
      <div className="service-item">
        <h3>Отзывы</h3>
        <span>Слетали на тур и он вам понраился? Оставьте свой отзыв!</span>
      </div>
      </div>
    </div>
  );
}

export default Services;
