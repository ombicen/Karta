import React, { useEffect, useRef } from "react";
import { Mousewheel, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";

import "swiper/css/scrollbar";

const VertScroll = ({ children, sliderState, pageLimit }) => {
  const [sliderIndex, setSliderIndex] = sliderState;
  const swiperRef = useRef(null);
  //create groupds of pageLimit children
  const groupedChildren = children.reduce((acc, child, index) => {
    const groupIndex = Math.floor(index / pageLimit);
    if (!acc[groupIndex]) {
      acc[groupIndex] = [];
    }
    acc[groupIndex].push(child);
    return acc;
  }, []);
  console.log(groupedChildren);
  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      if (
        swiperRef.current.swiper.activeIndex !==
        Math.floor(sliderIndex / pageLimit)
      ) {
        swiperRef.current.swiper.slideTo(Math.floor(sliderIndex / pageLimit));
      }
    }
  }, [sliderIndex, pageLimit]);
  return (
    <div className="flex flex-row flex-nowrap items-start justify-start h-full max-h-72 overflow-hidden mt-3">
      <Swiper
        ref={swiperRef}
        spaceBetween={0}
        direction="vertical"
        className="vertical-slider"
        autoHeight={true}
        mousewheel={true}
        pagination={{
          clickable: true,
          dynamicBullets: true,
          el: ".swiper-vert-dots",
          enabled: true,
        }}
        modules={[Mousewheel, Pagination]}
      >
        {groupedChildren.map((group, index) => (
          <SwiperSlide className="swiper-vert-slide" key={index}>
            {group.map((child, groupIndex) => (
              <div key={groupIndex}>{child}</div>
            ))}
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="px-5 mx-5">
        <div className="flex-1 flex justify-center items-center [&>div]:!transform-none h-[15rem] ml-[3rem]">
          <div className="swiper-vert-dots"></div>
        </div>
      </div>
    </div>
  );
};

export default VertScroll;
