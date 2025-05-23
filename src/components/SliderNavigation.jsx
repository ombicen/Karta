export default function SliderNavigation({
  currentSlide,
  totalSlides,
  slider,
  dotsInView = 5,
  hideArrows = false,
  activeColor = "#2337EC",
  inactiveColor = "#BBBED8",
  classNames,
}) {
  const goToSlide = (index) => {
    slider.slickGoTo(index);
  };
  const dotSize = 3;
  const gap = 2;
  const remOffsetBase = 5 * 0.25;

  const calculateTransform = () => {
    const transform =
      Math.max(0, Math.min(currentSlide - 2, totalSlides - dotsInView)) *
      remOffsetBase;
    return `translateX(-${transform}rem)`;
  };

  if (totalSlides <= 1) return null;

  return (
    <div
      className={`flex justify-between items-center ${
        classNames.wrapper ?? ""
      }`}
    >
      {!hideArrows && (
        <button
          onClick={() => slider.slickPrev()}
          className={"text-xl font-normal"}
          style={{ color: activeColor }}
        >
          Föregående
        </button>
      )}

      <div
        className={`flex justify-start mx-auto gap-2 overflow-hidden ${
          classNames.dots ?? ""
        }`}
        style={{
          maxWidth: `${remOffsetBase * dotsInView}rem`,
        }}
      >
        <div
          className={"flex items-center transition-all"}
          style={{ transform: calculateTransform(), gap: `${gap * 0.25}rem` }}
        >
          {Array.from({ length: totalSlides }, (_, index) => {
            const isFirstInView =
              index ===
              Math.max(0, Math.min(currentSlide - 2, totalSlides - dotsInView));
            const isLastInView =
              index ===
              Math.min(
                totalSlides - 1,
                Math.max(currentSlide + 2, dotsInView - 1)
              );
            const hasMoreSlidesBefore = currentSlide > 2;
            const hasMoreSlidesAfter = totalSlides - currentSlide > 3;
            const size =
              (isFirstInView && hasMoreSlidesBefore) ||
              (isLastInView && hasMoreSlidesAfter)
                ? dotSize * 0.5
                : dotSize;

            const isImmediateBeforeOrAfter =
              Math.abs(currentSlide - index) === 1 || currentSlide === index;
            return (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`rounded-full flex flex-col items-center justify-center focus:outline-none`}
                style={{
                  width: `${dotSize * 0.25}rem`,
                  height: `${dotSize * 0.25}rem`,
                }}
              >
                <span
                  className="transition-all"
                  style={{
                    width: `${
                      isImmediateBeforeOrAfter ? dotSize * 0.25 : size * 0.25
                    }rem`,
                    height: `${
                      isImmediateBeforeOrAfter ? dotSize * 0.25 : size * 0.25
                    }rem`,
                    backgroundColor:
                      index === currentSlide ? activeColor : inactiveColor,
                  }}
                  className="flex rounded-full flex-row items-center justify-center"
                ></span>
              </button>
            );
          })}
        </div>
      </div>
      {!hideArrows && (
        <button
          onClick={() => slider.slickNext()}
          className={"text-xl font-normal"}
          style={{ color: activeColor }}
        >
          Nästa
        </button>
      )}
    </div>
  );
}
