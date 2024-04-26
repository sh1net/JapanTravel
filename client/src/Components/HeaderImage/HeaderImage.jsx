import React from 'react';
import "./HeaderImage.css"

function HeaderImage({ children, blurBackground }) {
  return (
    <div className={`main_page_container ${blurBackground ? 'blur' : ''}`}>
      {children}
    </div>
  );
}

export default HeaderImage;
