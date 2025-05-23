import { InnanforskapetLogo } from "../Logos";
import BreadCrumbList from "./breadCrumbList";
import HamburgerButton from "./HamburgerButton";
import React, { useContext, useState } from "react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import menuContext from "../../lib/context";
import {
  AboutMap,
  AddInitiative,
  Contact,
  Initiatives,
  MenuPage,
} from "../Pages";
import { toast } from "react-hot-toast";
import Sponsorer from "../Sponsorer";

export default function MegaMenu({ content }) {
  const tempContext = useContext(menuContext);
  const [isLoading, setIsLoading] = useState(false);
  const menuState = [
    tempContext[0].isOpen,
    (newVal) => {
      tempContext[1]((prev) => {
        return { ...prev, isOpen: newVal };
      });
    },
  ];

  const formFields = [
    {
      type: "text",
      placeholder: "Namn på initiativ",
      name: "initiative_name",
      required: true,
    },
    { type: "text", placeholder: "Ort", name: "location", required: true },
    {
      type: "text",
      placeholder: "Kontaktperson",
      name: "responsible",
      required: true,
    },
    {
      type: "tel",
      placeholder: "Telefon till ansvarig",
      name: "phone",
      required: true,
    },
    {
      type: "email",
      placeholder: "E-mail till ansvarig",
      name: "email",
      required: true,
    },
    {
      type: "text",
      placeholder: "Initiativets webbplats",
      name: "website",
      required: true,
    },
    {
      type: "textarea",
      placeholder: "Kort beskrivning om initiativet",
      name: "description",
      required: true,
    },
  ];

  const submitForm = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    toast.promise(
      fetch("https://innanforskapetskarta.se/wp-json/smcm/v1/send-mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: "omer@acrowd.se",
          subject: "Nytt initiativ",
          message: "Ett nytt initiativ har skickats in.",
          ...data,
        }),
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.status === "success") {
            setIsLoading(false);
            return "Formuläret skickades framgångsrikt.";
          } else {
            setIsLoading(false);
            throw new Error("Misslyckades med att skicka formuläret.");
          }
        })
        .catch((error) => {
          setIsLoading(false);
          console.error("Error:", error);
          throw new Error(
            "Ett fel inträffade vid försök att skicka formuläret."
          );
        }),
      {
        loading: "Skickar...",
        success: "Formuläret skickades framgångsrikt.",
        error: "Ett fel inträffade vid försök att skicka formuläret.",
      }
    );
  };

  const pages = [
    {
      id: 0,
      title: "Meny",
      url: "/",
      leftComponent: <MenuPage />,
      rightContent: (
        <div className="relative max-h-[calc(100%-10rem)] h-full">
          <div className="absolute -left-[6.25rem] -bottom-6 p-10 text-white bg-[#2337EC] text-3xl max-w-96">
            Tillsammans kan vi synliggöra lösningar och sprida kunskap, så att
            fler kan vara med och göra skillnad.
          </div>
          <img
            src="https://innanforskapetskarta.se/wp-content/plugins/acrowd-sv-maps/build/images/menuimage.jpg"
            alt="menuimage"
            className="h-full mt-1"
          />
        </div>
      ),
    },
    {
      id: 1,
      title: "Om kartan",
      url: "/om-kartan",
      leftComponent: <AboutMap />,
      rightContent: (
        <div className="relative max-h-[calc(100%-10rem)] h-full ">
          <div className="absolute -left-[6.25rem] bottom-11 p-10 text-white bg-[#2337EC] text-3xl max-w-96 flex flex-col">
            Är du med och ökar innanförskapet? Sätt det på kartan
            <Button
              endContent={
                <ChevronRightIcon className="w-[10px] ml-4 text-[#2237EC]" />
              }
              className="bg-white text-[#2237EC] rounded-full px-8 py-3 self-start mt-5"
              onPress={() => setCurrentPage(3)}
            >
              <span className="ml-4">Lägg till initiativ</span>
            </Button>
          </div>
          <img
            src="https://innanforskapetskarta.se/wp-content/plugins/acrowd-sv-maps/build/images/ominnanfor.jpg"
            alt="menuimage"
            className="h-full mt-1"
          />
        </div>
      ),
    },
    {
      id: 2,
      title: "Alla initiativ",
      url: "/initiativ",
      leftComponent: <Initiatives content={content} />,
      rightContent: (
        <div className="relative max-h-[calc(100%-10rem)] h-full ">
          <div className="absolute -left-[6.25rem] bottom-11 p-10 text-white bg-[#2337EC] text-3xl max-w-96 flex flex-col">
            Tillsammans kan vi synliggöra lösningar och sprida kunskap, så att
            fler kan vara med och göra skillnad.
            <Button
              endContent={
                <ChevronRightIcon className="w-[10px] ml-4 text-[#2237EC]" />
              }
              onPress={() => setCurrentPage(3)}
              className="bg-white text-[#2237EC] rounded-full px-8 py-3 self-start mt-5"
            >
              <span className="ml-4">Lägg till initiativ</span>
            </Button>
          </div>
          <img
            src="https://innanforskapetskarta.se/wp-content/plugins/acrowd-sv-maps/build/images/allainitiativ.jpg"
            alt="menuimage"
            className="h-full mt-1"
          />
        </div>
      ),
    },
    {
      id: 3,
      title: "Lägg till initiativ",
      url: "/initiativ/ny",
      leftComponent: <AddInitiative />,
      rightContent: (
        <div className="w-full md:max-w-[40rem] ">
          <form className="space-y-1 md:space-y-4 w-full" onSubmit={submitForm}>
            {formFields.map((field, index) => (
              <div key={index}>
                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    placeholder={field.placeholder}
                    className="bg-transparent border-b-1 border-[#2337EC] w-full  text-lg md:text-xl outline-none py-1 md:py-3"
                    required={field.required}
                  ></textarea>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    required={field.required}
                    placeholder={field.placeholder}
                    className="bg-transparent border-b-1 border-[#2337EC] w-full text-lg md:text-xl outline-none py-1 md:py-3"
                  />
                )}
              </div>
            ))}
            <div>
              <Button
                type="submit"
                isLoading={isLoading}
                className="bg-[#2337EC] text-white px-4 py-7 rounded-full w-full text-xl flex flex-row justify-center items-center"
              >
                <span className="text-2xl">Skicka</span>
              </Button>
            </div>
          </form>
        </div>
      ),
    },
    {
      id: 4,
      title: "Kontakt",
      url: "/kontakt",
      leftComponent: <Contact />,
      rightContent: (
        <div className="relative max-h-[calc(100%-10rem)] h-full ">
          <div className="absolute -left-[6.25rem] bottom-11 p-10 text-white bg-[#2337EC] text-3xl max-w-96 flex flex-col">
            Är du med och ökar innanförskapet? Sätt det på kartan
            <Button
              endContent={
                <ChevronRightIcon className="w-[10px] ml-4 text-[#2237EC]" />
              }
              onPress={() => setCurrentPage(3)}
              className="bg-white text-[#2237EC] rounded-full px-8 py-3 self-start mt-5"
            >
              <span className="ml-4">Lägg till initiativ</span>
            </Button>
          </div>
          <img
            src="https://innanforskapetskarta.se/wp-content/plugins/acrowd-sv-maps/build/images/contact.jpg"
            alt="menuimage"
            className="h-full mt-1"
          />
        </div>
      ),
    },
  ];
  const [currentPage, setCurrentPage] = [
    tempContext[0].currentPage,
    (newVal) => {
      tempContext[1]((prev) => {
        return { ...prev, currentPage: newVal };
      });
    },
  ];
  return (
    <>
      <header className="flex flex-row absolute top-0 left-0 z-30 py-5 px-8 md:p-14 justify-between items-center w-screen text-white pointer-events-auto md:pointer-events-none">
        <div className="mx-1">
          <a
            href="https://innanforskapetskarta.se/"
            className="pointer-events-auto"
          >
            <InnanforskapetLogo className="text-[#2337EC] w-[12rem]" />
          </a>
          {menuState[0] && (
            <BreadCrumbList
              setPage={setCurrentPage}
              page={currentPage}
              pages={pages}
            />
          )}
        </div>

        <HamburgerButton menuState={menuState} />
      </header>

      <div
        className={`absolute flex-col pb-2 md:flex-row transition-all max-w-[100vw] h-auto md:h-screen duration-300 opacity-0 top-0 pt-32 left-0 z-20 min-h-screen w-screen bg-[#EBECFB] ${
          menuState[0]
            ? "flex pointer-events-auto !opacity-100"
            : "hidden md:flex pointer-events-none"
        }`}
      >
        <main className="flex flex-col md:flex-row m-0 justify-between px-10 md:px-14 h-full w-full min-h-[calc(100vh-16rem)] md:min-h-unset">
          <div>
            <div className="text-4xl mt-10 md:mt-[4.6875rem]">
              {pages[currentPage].title}
            </div>
            <div className=" mt-10 md:mt-[4.6875rem]">
              {pages[currentPage].id === 0
                ? React.cloneElement(pages[currentPage].leftComponent, {
                    pages,
                    setCurrentPage,
                  })
                : pages[currentPage].leftComponent}
            </div>
          </div>
          <div
            className={`${
              currentPage !== 3 && "hidden"
            } md:flex flex-col justify-start items-end h-full pt-[3.125rem] md:min-w-[40rem]`}
          >
            {pages[currentPage].rightContent}
          </div>
        </main>
        <footer className="relative md:absolute bottom-0 right-0 w-full p-0 m-0 ">
          <Sponsorer
            classNames={{
              container:
                "flex flex-row flex-1 items-center text-black fill-black justify-end p-14",
              logos: "max-h-10 text-black fill-black",
            }}
          />
        </footer>
      </div>
    </>
  );
}
