import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Box } from '@mui/system';
import { Saleproductdata } from '../Data/Sale';

const Saleproduct = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
    ],
  };

  return (
    <Box style={{ width: '100%', height: '100%', }}>
      <Slider {...settings}>
        {Saleproductdata.map((product) => (
          <div key={product.id}
            sx={{
              height: '500px', 
              objectFit: "cover",
            }}
          >
            <img
              src={product.image}
              alt={product.alt}
              style={{
                width: '100%',
                height: '100%',
                // objectFit: "cover",
                zIndex:-10
              }}
            />
          </div>
        ))}
      </Slider>
    </Box>
  );
};

export default Saleproduct; 
