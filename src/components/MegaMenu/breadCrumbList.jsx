import { ChevronRightIcon } from "@heroicons/react/24/outline";
import React from "react";
import { useContext } from "react";
import menuContext from "../../lib/context";
import { menu } from "framer-motion/client";

export default function BreadCrumbList({ page, setPage, pages }) {
  const menuStates = useContext(menuContext);
  return (
    <div className="flex flex-row gap-2 mt-2 px-0 py-3 text-[#667085] text-xl pointer-events-auto">
      <a
        href="#"
        onClick={() => {
          menuStates[1]((prev) => {
            return { ...prev, isOpen: false };
          });
        }}
      >
        Kartan
      </a>
      <ChevronRightIcon className={`w-4 text-[#667085]`} />
      <a
        href="#"
        className={` ${
          pages[page].id == 0 ? "text-[#2337EC]" : "text-[#667085]"
        }`}
        onClick={() => setPage(pages[0].id)}
      >
        Meny
      </a>
      {pages[page] && !pages[page].id == 0 && (
        <>
          <ChevronRightIcon className="text-[#667085] w-4" />
          <a href="#" className="text-[#2337EC]">
            {pages[page].title}
          </a>
        </>
      )}
    </div>
  );
}
