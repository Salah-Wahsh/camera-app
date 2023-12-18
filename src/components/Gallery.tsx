import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface GalleryProps {
  images: any[]; // You can replace 'any' with the actual type of your image data
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="gallery">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="image-item">
            <img src={image} alt={`Captured Image ${index + 1}`} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Gallery;
