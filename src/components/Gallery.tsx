import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Button from "./Partials/Button";
import ImageType  from "../utils/generalTypes";

interface GalleryProps {
  images: ImageType[];
  handleBackButton: () => void;
}

const Gallery: React.FC<GalleryProps> = ({ images, handleBackButton }) => {
  return (
    <>
      <div className="pt-10 flex justify-center">
        <div className=" md:w-[50%] w-[50%] items-start">
          <div className="gallery">
            <Carousel>
              {images.map((image, index) => (
                <div key={index} className="image-item">
                  <img src={image} alt={`Captured Image ${index + 1}`} />
                </div>
              ))}
            </Carousel>
            <div className="absolute left-10 bottom-10">
              <Button onClick={handleBackButton}>Back</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Gallery;
