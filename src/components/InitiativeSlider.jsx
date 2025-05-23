import React, { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

import { Navigation, Pagination } from "swiper/modules";

const InitiativeSlider = ({
  children,
  settings = { dotArrow: true },
  sliderState = [0, () => {}],
}) => {
  const [sliderIndex, setSliderIndex] = sliderState;
  const swiperRef = useRef(null);

  const paginationSettings = {
    clickable: true,
    dynamicBullets: true,
    el: ".swiper-dots-horizontal" + settings.classNames?.slider ?? "",
  };

  const navigationSettings = {
    nextEl: ".swiper-button-vert-next",
    prevEl: ".swiper-button-vert-prev",
  };

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(sliderIndex);
    }
  }, [sliderIndex]);

  return (
    <div
      id="left-slider"
      className={`relative w-full flex flex-col ${
        settings.classNames?.wrapper ?? ""
      }`}
      style={
        settings.classNames?.slider === "phone-slider"
          ? {
              "--swiper-pagination-bullet-inactive-color": "#FFF",
              "--swiper-pagination-color": "#FFF",
            }
          : {}
      }
    >
      <Swiper
        ref={swiperRef}
        spaceBetween={50}
        slidesPerView={1}
        onSlideChange={(swiper) => setSliderIndex(swiper.activeIndex)}
        pagination={paginationSettings}
        navigation={navigationSettings}
        modules={[Pagination, Navigation]}
        className={`horizontal-slider w-full ${
          settings.classNames?.slider ?? ""
        }`}
      >
        {children.map((child, index) => (
          <SwiperSlide key={index}>{child}</SwiperSlide>
        ))}
      </Swiper>
      {children.length > 1 && (
        <div className="flex flex-row items-center justify-between w-full md:pt-5  md:mt-5  border-t border-[#2337EC] relative">
          {!settings.dotArrow && (
            <button className="swiper-button-vert-prev text-[#2337EC] text-xl cursor-pointer relative z-10">
              Föregående
            </button>
          )}
          <div className="flex-1 flex justify-center absolute top-0 left-0 w-full md:mt-7 [&>div]:!transform-none z-0">
            <div
              className={"swiper-dots-horizontal" + settings.classNames?.slider}
            ></div>
          </div>
          {!settings.dotArrow && (
            <button className="swiper-button-vert-next text-[#2337EC] text-xl cursor-pointer relative z-10">
              Nästa
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default InitiativeSlider;
