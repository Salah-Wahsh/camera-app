import React from "react";

interface GalleryProps {
  images: any[]; // You can replace 'any' with the actual type of your image data
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  return (
    <div className="gallery">
      <div className="image-list">
        {images.map((image, index) => (
          <div key={index} className="image-item">
            <img src={image} alt={`Captured Image ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
