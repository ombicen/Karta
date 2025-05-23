import React, { useEffect, useState } from "react";
import MapComponent from "./components/SwedenMap";
import { HeroUIProvider } from "@heroui/react";
import MegaMenu from "./components/MegaMenu";
import menuContext from "./lib/context";
import { toast, Toaster, ToastBar } from "react-hot-toast";
import { XMarkIcon } from "@heroicons/react/24/outline";

function App() {
  const dev = false;
  const [data, setData] = useState({
    regions: null,
    municipals: null,
    contents: {},
  });
  const menuState = useState({
    isOpen: false,
    currentPage: 0,
  });

  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const api_url = dev
    ? "http://theeataly.test"
    : "https://innanforskapetskarta.se/";

  useEffect(() => {
    fetch(api_url + "/wp-json/smcm/v1/data")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Nätverksfel vid hämtning av data.");
        }
        return response.json();
      })
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Fel vid hämtning av data:", error);
        setLoading(false);
        setFailed(true);
      });
  }, [api_url]);

  if (loading) {
    return (
      <div className="grid min-h-[140px] w-full h-full place-items-center rounded-lg p-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          fill="none"
          className="text-blue-100 animate-spin"
          viewBox="0 0 64 64"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="5"
            d="M32 3a29 29 0 1 1 0 58 29 29 0 0 1 0-58"
          ></path>
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="5"
            d="M32 3a29 29 0 0 1 27.576 37.976"
            className="text-blue-600"
          ></path>
        </svg>
      </div>
    );
  }
  if (failed) {
    return (
      <div
        className="bg-blue-100 border-t-4 border-blue-500 rounded-b text-blue-900 px-4 py-3 shadow-md"
        role="alert"
      >
        <div className="flex">
          <div className="py-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="fill-current h-6 w-6 text-blue-500 mr-4"
              viewBox="0 0 20 20"
            >
              <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07m12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32M9 11V9h2v6H9zm0-6h2v2H9z"></path>
            </svg>
          </div>
          <div>
            <p className="font-bold">Kunde inte ladda data från api</p>
            <p className="text-sm">
              Detta kan bero på felkonfiguration eller serverfel försök igen
              senare!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <HeroUIProvider>
        <menuContext.Provider value={menuState}>
          <Toaster>
            {(t) => (
              <ToastBar toast={t}>
                {({ icon, message }) => (
                  <>
                    {icon}
                    {message}
                    {t.type !== "loading" && (
                      <button onClick={() => toast.dismiss(t.id)}>
                        <XMarkIcon className="w-5" />
                      </button>
                    )}
                  </>
                )}
              </ToastBar>
            )}
          </Toaster>

          <MegaMenu content={data.contents} />
          <MapComponent
            regions={data.regions}
            municipals={data.municipals}
            content={data.contents}
            relations={data.relations}
            main={data.main}
          />
        </menuContext.Provider>
      </HeroUIProvider>
    </div>
  );
}

export default App;
