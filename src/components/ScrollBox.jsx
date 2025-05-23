import styled, { css } from "styled-components";

const StyledScrollBox = styled.div`
  position: relative;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  padding-right: 0.75rem; /* motsvarar pr-3 */
  margin-right: 5px;

  &::-webkit-scrollbar {
    width: 0.25rem;
  }
  &::-webkit-scrollbar-track {
    border-radius: 9999px;
    background: ${({ $scrollTrackerColor }) => $scrollTrackerColor};
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 9999px;
    background: ${({ $scrollColor }) => $scrollColor};
  }
  ${({ mask, $maskHeight, $maskColor, $maskPosition }) =>
    mask &&
    css`
      /* Add padding on the masked side(s) to ensure content isn’t hidden */
      ${$maskPosition === "both" &&
      css`
        padding-top: ${$maskHeight}px;
        padding-bottom: ${$maskHeight}px;
      `}
      ${$maskPosition === "top" &&
      css`
        padding-top: ${$maskHeight}px;
      `}
      ${$maskPosition === "bottom" &&
      css`
        padding-bottom: ${$maskHeight}px;
      `}

      /* Set up CSS variables for our mask calculations */
      --scrollbar-width: 0.25rem;
      --mask-height: ${$maskHeight}px;

      /* Choose a gradient based on the mask position */
      ${$maskPosition === "both" &&
      css`
        --mask-image-content: linear-gradient(
          to bottom,
          transparent,
          ${$maskColor || "black"} var(--mask-height),
          ${$maskColor || "black"} calc(100% - var(--mask-height)),
          transparent
        );
      `}
      ${$maskPosition === "top" &&
      css`
        --mask-image-content: linear-gradient(
          to bottom,
          transparent,
          ${$maskColor || "black"} var(--mask-height),
          ${$maskColor || "black"} 100%
        );
      `}
      ${$maskPosition === "bottom" &&
      css`
        --mask-image-content: linear-gradient(
          to bottom,
          ${$maskColor || "black"} 0%,
          ${$maskColor || "black"} calc(100% - var(--mask-height)),
          transparent
        );
      `}

      /* The mask for the content area and scrollbar */
      --mask-size-content: calc(100% - var(--scrollbar-width)) 100%;
      --mask-image-scrollbar: linear-gradient(
        ${$maskColor || "black"},
        ${$maskColor || "black"}
      );
      --mask-size-scrollbar: var(--scrollbar-width) 100%;

      /* Apply both mask images */
      mask-image: var(--mask-image-content), var(--mask-image-scrollbar);
      mask-size: var(--mask-size-content), var(--mask-size-scrollbar);
      mask-position: 0 0, 100% 0;
      mask-repeat: no-repeat, no-repeat;
    `}
`;

export default function ScrollBox({
  scrollColor = "#7B87F4",
  scrollTrackerColor = "#4F5EEF",
  mask = false,
  maskHeight = 20,
  maskPosition = "bottom", // "top", "bottom", or "both"
  maskColor,
  className = "",
  children,
  ...rest
}) {
  return (
    <StyledScrollBox
      $scrollColor={scrollColor}
      $scrollTrackerColor={scrollTrackerColor}
      mask={mask}
      $maskHeight={maskHeight}
      $maskColor={maskColor}
      $maskPosition={maskPosition}
      className={className}
      {...rest}
    >
      {children}
    </StyledScrollBox>
  );
}
