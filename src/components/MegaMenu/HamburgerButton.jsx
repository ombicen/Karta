import "./burger.css";
import React, { use, useState } from "react";
import { useContext } from "react";
import menuContext from "../../lib/context";

export default function HamburgerButton() {
  const tempContext = useContext(menuContext);
  const [isOpen, setIsOpen] = [
    tempContext[0].isOpen,
    (newVal) => {
      tempContext[1]((prev) => {
        return { ...prev, isOpen: newVal };
      });
    },
  ];
  const [page, setPage] = [
    tempContext[0].currentPage,
    (newVal) => {
      tempContext[1]((prev) => {
        return { ...prev, currentPage: newVal };
      });
    },
  ];
  return (
    <button
      className={`hamburger hamburger--collapse pointer-events-auto absolute right-10 md:right-14 top-7 md:top-10 !p-0 ${
        isOpen && "is-active"
      } z-20 bg-[#2337EC]`}
      type="button"
      onClick={() => {
        setIsOpen(!isOpen);
        setTimeout(() => {
          setPage(0);
        }, 300);
      }}
    >
      <span className="hamburger-box">
        <span className="hamburger-inner"></span>
      </span>
    </button>
  );
}
