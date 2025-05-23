import { twMerge } from "tailwind-merge";
import { AxelssonLogo, JarvaLogo } from "./Logos";

export default function Sponsorer({
  classNames = {
    title: "text-base text-[#EBECFB]",
    container: "",
    logos: "",
  },
  title = "",
}) {
  let activeClasses = {
    title: twMerge("text-base text-[#EBECFB]", classNames.title),
    container: twMerge(
      "flex flex-row gap-6 items-center mb-2",
      classNames.container
    ),
    logos: twMerge("fill-white max-h-8 h-full w-full ", classNames.logos),
  };

  return (
    <>
      <div className={activeClasses.container}>
        {title && <h2 className={activeClasses.title}>{title}</h2>}
        <AxelssonLogo className={activeClasses.logos} />
        <JarvaLogo className={activeClasses.logos} />
      </div>
    </>
  );
}
