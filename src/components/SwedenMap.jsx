import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
  useContext,
} from "react";
import DOMPurify from "dompurify";
import ReactMarkdown from "react-markdown";

import * as d3 from "d3";
import * as turf from "@turf/turf";
import menuContext from "../lib/context";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  InformationCircleIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import AxelssonModal, {
  AxelssonModalBody,
  AxelssonModalFooter,
  AxelssonModalHeader,
} from "./AxelssonsDrawer";
import { Button } from "@heroui/button";
import { useWindowDimensions, useDimensions } from "../utils/sizes";
import ScrollBox from "./ScrollBox";
import InitiativeSlider from "./InitiativeSlider";
import Sponsorer from "./Sponsorer";
import VertScroll from "./VertScroll";

// --- Utility Functions ---
const removeLastS = (str) => (str.endsWith("s") ? str.slice(0, -1) : str);
const sanitizeEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
const sanitizePhone = (phone) =>
  /^\+?[0-9\- ]{7,20}$/.test(phone) ? phone : "";

// --- Factorized: Content Footer ---
function ContentFooter({ entry }) {
  return (
    <footer className="flex flex-row items-center mt-auto">
      <div className="flex flex-col text-sm">
        <span>{entry.author}</span>
        <span>
          <a
            href={
              sanitizeEmail(entry.mail)
                ? `mailto:${sanitizeEmail(entry.mail)}`
                : undefined
            }
            target="_blank"
            rel="noreferrer"
          >
            {entry.mail}
          </a>
        </span>
        <span>
          <a
            href={
              sanitizePhone(entry.phone)
                ? `tel:${sanitizePhone(entry.phone)}`
                : undefined
            }
            target="_blank"
            rel="noreferrer"
          >
            {entry.phone}
          </a>
        </span>
        <span>
          <a
            href={entry.website}
            className="underline"
            target="_blank"
            rel="noreferrer"
          >
            Webbsida
          </a>
        </span>
      </div>
      {entry.external_link && (
        <div className="flex flex-col ml-auto self-end">
          <a
            href={entry.external_link}
            className="rounded-full bg-[#2337EC] text-white py-2 px-4 text-sm min-w-20"
          >
            Läs mer
          </a>
        </div>
      )}
    </footer>
  );
}

// --- Factorized: Initiative Slide ---
function InitiativeSlide({ entry }) {
  return (
    <div className="px-2">
      <h3 className="text-3xl">{entry.title}</h3>
      <ScrollBox
        scrollColor="#4F5EEF"
        scrollTrackerColor="#A6AFF6"
        mask
        maskHeight={50}
        className="text-xl mt-5 mb-10 max-h-10 md:max-h-16 lg:max-h-80"
        height={310}
      >
        <ReactMarkdown>{DOMPurify.sanitize(entry.content || "")}</ReactMarkdown>
      </ScrollBox>
      <ContentFooter entry={entry} />
    </div>
  );
}

// --- Factorized: Mobile Initiative Slide ---
function MobileInitiativeSlide({ entry, selectedRegion, selectedMunicipal }) {
  return (
    <div className="flex flex-col">
      <ModalHeader className="flex flex-col gap-1 mt-4 ">
        <div className="text-sm font-normal">
          Region {removeLastS(selectedRegion?.properties?.LnNamn ?? "")}
        </div>
        <div className="text-2xl font-medium leading-6">
          {selectedMunicipal?.properties?.KnNamn ?? ""}
        </div>
        <h3 className="text-3xl font-normal leading-1 mt-5">{entry.title}</h3>
      </ModalHeader>
      <ModalBody>
        <ScrollBox mask maskHeight={50} className="max-h-32">
          <div className="pb-2 text-xl">
            <ReactMarkdown>
              {DOMPurify.sanitize(entry.content || "")}
            </ReactMarkdown>
          </div>
        </ScrollBox>
      </ModalBody>
      <ModalFooter className="flex flex-col justify-start gap-0 mt-auto [&_a]:underline">
        <ContentFooter entry={entry} />
      </ModalFooter>
    </div>
  );
}

// --- Factorized: Initiative Slider List ---
function InitiativeSliderList({ entries, sliderRef, sliderState, settings }) {
  return (
    <InitiativeSlider
      ref={sliderRef}
      sliderState={sliderState}
      settings={settings}
    >
      {entries.map((entry, index) => (
        <InitiativeSlide entry={entry} key={`${index}_slide`} />
      ))}
    </InitiativeSlider>
  );
}

// --- Factorized: Search List ---
function SearchList({
  type,
  regions,
  content,
  onRegionClick,
  onInitiativeClick,
}) {
  if (type === "region") {
    return regions.features
      .sort((a, b) => a.properties.LnNamn.localeCompare(b.properties.LnNamn))
      .map((region) => (
        <button
          key={"region_" + region.properties.LnKod}
          className="text-2xl leading-10 w-full break-words text-left"
          onClick={() => onRegionClick(region)}
        >
          {region.properties.LnNamn}
        </button>
      ));
  }
  return content
    .sort((a, b) => a.title.localeCompare(b.title))
    .map((entry) => (
      <button
        key={"initiativ_" + entry.title}
        className="text-2xl leading-10 w-full break-words text-left"
        onClick={() => onInitiativeClick(entry)}
      >
        {entry.title}
      </button>
    ));
}

// --- Main SwedenMap Component ---
const SwedenMap = ({
  regions,
  municipals,
  content: tempContent,
  main = { title: "", text: "" },
}) => {
  const tempContext = useContext(menuContext);
  const content = Array.isArray(tempContent)
    ? tempContent
    : Object.values(tempContent);
  const svgRef = useRef(null);
  const zoomRef = useRef(null);
  const mapContainerRef = useRef(null);
  const modalRef = useRef(null);
  let sliderRef = useRef(null);

  const windowDimensions = useWindowDimensions();
  const { width: containerWidth, height: containerHeight } =
    useDimensions(mapContainerRef);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedMunicipal, setSelectedMunicipal] = useState(null);
  const [selectedInitiative, setSelectedInitiative] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [search, setSearch] = useState({});

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const {
    isOpen: isOpenAxel,
    onOpen: onOpenAxel,
    onOpenChange: onOpenChangeAxel,
  } = useDisclosure();

  const {
    isOpen: isOpenAxelAll,
    onOpen: onOpenAxelAll,
    onOpenChange: onOpenChangeAxelAll,
  } = useDisclosure();

  // Skapa relationen mellan regioner och kommuner med Turf.js
  const municipalsByRegion = useMemo(() => {
    const map = {};
    regions.features.forEach((region) => {
      const regionId = region.properties.LnKod;
      const flattenedRegion = turf.flatten(region);
      map[regionId] = municipals.features
        .filter((municipal) => {
          const interiorPoint = turf.pointOnFeature(municipal);
          return flattenedRegion.features.some((poly) =>
            turf.booleanPointInPolygon(interiorPoint, poly)
          );
        })
        .sort((a, b) => a.properties.KnNamn.localeCompare(b.properties.KnNamn));
    });
    return map;
  }, [regions.features, municipals.features]);

  // Skapa en mappning av innehåll för regioner och kommuner
  const contentMap = useMemo(() => {
    const mapping = {
      municipal: new Map(),
      region: new Map(),
      municipalsByRegion: {},
    };

    // Steg 1: Bygg upp listan
    content.forEach((entry) => {
      // Spara inlägg för snabb uppslagning
      if (!mapping[entry.type].has(entry.feature_id)) {
        mapping[entry.type].set(entry.feature_id, []);
      }
      mapping[entry.type].get(entry.feature_id).push(entry);

      if (entry.type === "municipal") {
        const regionId = entry.region_id;

        // Skapa en struktur om den inte finns
        if (!mapping.municipalsByRegion[regionId]) {
          mapping.municipalsByRegion[regionId] = {
            list: [],
            indexMap: {},
          };
        }

        // Lägg till inlägget i listan för regionen
        mapping.municipalsByRegion[regionId].list.push(entry);
      }
    });

    // Steg 2: Sortera varje lista alfabetiskt (justera 'title' till rätt egenskap om det behövs)
    Object.keys(mapping.municipalsByRegion).forEach((regionId) => {
      const regionData = mapping.municipalsByRegion[regionId];
      regionData.list.sort((a, b) => a.title.localeCompare(b.title));
    });

    // Steg 3: Uppdatera indexMap baserat på den sorterade listan
    Object.keys(mapping.municipalsByRegion).forEach((regionId) => {
      const regionData = mapping.municipalsByRegion[regionId];
      regionData.indexMap = regionData.list.reduce((acc, entry, index) => {
        // Kontrollera att acc[entry.feature_id] är deklarerad
        if (!acc[entry.feature_id]) {
          acc[entry.feature_id] = {};
        }
        // Sätt den andra nyckeln (title) med index som värde
        acc[entry.feature_id][entry.title] = index;
        return acc;
      }, {});
    });

    return {
      municipal: Object.fromEntries(mapping.municipal),
      region: Object.fromEntries(mapping.region),
      municipalsByRegion: mapping.municipalsByRegion,
    };
  }, [content]);

  // Konstanta värden för SVG-dimensioner
  const width = +containerWidth;
  const height = +containerHeight;

  const handleZoomIn = useCallback(() => {
    d3.select(svgRef.current)
      .transition()
      .duration(400)
      .call(zoomRef.current.scaleBy, 2, [width / 2, height / 2]);
  }, [width, height]);

  const handleZoomOut = useCallback(() => {
    d3.select(svgRef.current)
      .transition()
      .duration(400)
      .call(zoomRef.current.scaleBy, 0.5, [width / 2, height / 2]);
  }, [width, height]);

  // Memoized callbacks for event handlers in render
  const handleRegionClick = useCallback(
    (region) => {
      setSelectedIndex(0);
      setSelectedRegion(region);
    },
    [setSelectedIndex, setSelectedRegion]
  );

  const handleMunicipalClick = useCallback(
    (index) => {
      setSelectedIndex(index);
    },
    [setSelectedIndex]
  );

  const handleBackToRegions = useCallback(() => {
    setSelectedRegion(null);
    setSelectedMunicipal(null);
  }, []);

  const handleAllRegionsModalRegionClick = useCallback(
    (region) => {
      setSelectedRegion(region);
      onOpenChangeAxelAll(false);
      onOpen();
    },
    [setSelectedRegion, onOpenChangeAxelAll, onOpen]
  );

  const handleAllRegionsModalInitiativeClick = useCallback(
    (entry) => {
      setSelectedRegion(
        regions.features.find(
          (region) => region.properties.LnKod === entry.region_id
        )
      );
      onOpenChangeAxelAll();
      setSelectedIndex(() => {
        const index =
          contentMap.municipalsByRegion[entry.region_id].indexMap[
            entry.feature_id
          ][entry.title];
        return index;
      });
      onOpen();
    },
    [
      regions.features,
      contentMap.municipalsByRegion,
      setSelectedRegion,
      setSelectedIndex,
      onOpenChangeAxelAll,
      onOpen,
    ]
  );

  const handleAddInitiative = useCallback(() => {
    tempContext[1]((prev) => {
      return { isOpen: true, currentPage: 3 };
    });
  }, [tempContext]);

  const handleAddInitiativeAndCloseAxel = useCallback(() => {
    tempContext[1]((prev) => {
      return { isOpen: true, currentPage: 3 };
    });
    onOpenChangeAxel();
  }, [tempContext, onOpenChangeAxel]);

  const handleAddInitiativeAndCloseAxelAll = useCallback(() => {
    tempContext[1]((prev) => {
      return { isOpen: true, currentPage: 3 };
    });
    onOpenChangeAxelAll();
  }, [tempContext, onOpenChangeAxelAll]);

  const handleSearchRegionToggle = useCallback(() => {
    setSearch((prev) => {
      return {
        type: search.type === "region" ? "" : "region",
        show: search.type === "region" ? !search.show : true,
      };
    });
  }, [search.type, search.show]);

  const handleSearchContentToggle = useCallback(() => {
    setSearch({
      type: search.type === "content" ? "" : "content",
      show: search.type === "content" ? !search.show : true,
    });
  }, [search.type, search.show]);

  useEffect(() => {
    if (!regions || !regions.features) {
      console.error(
        "Error: Missing regions data or regions.features is not defined."
      );
      return;
    }
    if (!municipals || !municipals.features) {
      console.error(
        "Error: Missing municipals data or municipals.features is not defined."
      );
      return;
    }

    if (!width || !height) {
      console.error(
        "Error: Invalid dimensions. Width:",
        width,
        "Height:",
        height
      );
      return;
    }
    if (
      selectedRegion &&
      !contentMap.municipalsByRegion[selectedRegion.properties.LnKod]
    ) {
      onOpenAxel();
      return;
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg
      .attr(
        "viewBox",
        `0 0 ${width > 0 ? width : 0} ${height > 0 ? height : 0}`
      )
      .attr("width", width > 0 ? width : 0)
      .attr("height", height > 0 ? height : 0);

    const g = svg.append("g");
    const stretchY = 2;

    const projection = d3
      .geoIdentity()
      .reflectY(true)
      .fitExtent(
        [
          [20, 20],
          [width, (height / stretchY) * 0.9],
        ],
        regions
      );

    const customProjection = d3.geoTransform({
      point: function (x, y) {
        const [px, py] = projection([x, y]);
        this.stream.point(px, py * stretchY);
      },
    });

    const pathGenerator = d3.geoPath().projection(customProjection);

    const zoom = d3
      .zoom()
      .scaleExtent([1, 8])
      .translateExtent([
        [0, 0],
        [width, height],
      ])

      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    function reset() {
      setSelectedRegion(null);
      setSelectedMunicipal(null);

      svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
    }
    zoomRef.current = zoom;

    // Rita regionerna
    g.selectAll("path.region")
      .data(regions.features)
      .enter()
      .append("path")
      .attr("class", "region")
      .attr("fill", (d) => {
        if (contentMap["municipalsByRegion"][d.properties.LnKod])
          return "#2337ec";
        if (
          selectedRegion &&
          selectedRegion.properties.LnKod === d.properties.LnKod
        )
          return "#A6AFF6";
        return "#A6AFF6";
      })
      .attr("stroke", "#EBECFB")
      .attr("fill-opacity", 1)
      .attr("stroke-width", (d) =>
        selectedRegion && selectedRegion.properties.LnKod === d.properties.LnKod
          ? 0
          : 1
      )
      .attr("vector-effect", "non-scaling-stroke")
      .attr("d", pathGenerator)
      .on("click", (event, d) => {
        event.stopPropagation();
        if (!contentMap["municipalsByRegion"][d.properties.LnKod]) {
          setSelectedMunicipal(null);
          setSelectedInitiative(null);
          setSelectedRegion(d);
          return;
        }
        setSelectedMunicipal(null);

        setSelectedIndex(0);
        setSelectedRegion(
          selectedRegion?.properties.LnKod === d.properties.LnKod ? null : d
        );

        if (windowDimensions.width < 768) {
          onOpen();
        }
      });
    svg.call(zoom);

    if (selectedRegion) {
      const [[x0, y0], [x1, y1]] = pathGenerator.bounds(selectedRegion);
      const scale = Math.min(width / (x1 - x0), height / (y1 - y0)) * 0.9;
      if (selectedMunicipal) {
        const [cx, cy] = pathGenerator.centroid(selectedMunicipal);
        // Använd samma skalfaktor men ändra translationen så att kommunens center hamnar i mitten
        const translateX = width / 2 - scale * cx;
        const translateY =
          (!isOpen ? height : height - modalRef.current.offsetHeight) / 2 -
          scale * cy;

        svg
          .transition()
          .duration(750)
          .call(
            zoom.transform,
            d3.zoomIdentity.translate(translateX, translateY).scale(scale)
          );
      } else {
        const translateX = width / 2 - (scale * (x0 + x1)) / 2;
        const translateY = height / 2 - (scale * (y0 + y1)) / 2;

        svg
          .transition()
          .duration(750)
          .call(
            zoom.transform,
            d3.zoomIdentity.translate(translateX, translateY).scale(scale)
          );
      }
      // Rita ut kommunerna

      g.selectAll("path.municipal")
        .data(municipalsByRegion[selectedRegion.properties.LnKod])
        .enter()
        .append("path")
        .attr("class", "municipal")

        .attr("d", pathGenerator)

        .attr("fill", (d) => {
          if (
            selectedMunicipal &&
            selectedMunicipal.properties.KnKod === d.properties.KnKod
          ) {
            return "#000F92";
          }
          if (
            contentMap["municipal"] &&
            contentMap["municipal"][d.properties.KnKod]
          ) {
            return "#2337ec";
          }
          return "#2337ec";
        })
        .attr("fill-opacity", 1)

        .attr("stroke", "#EBECFB")
        .attr("stroke-width", 1)
        .attr("vector-effect", "non-scaling-stroke")
        .on("click", (event, d) => {
          event.stopPropagation();
          //check if region has any content if not set region to null

          if (
            Object.values(
              contentMap.municipalsByRegion[selectedRegion.properties.LnKod]
                .indexMap
            ).length === 0
          ) {
            setSelectedRegion(null);
            setSelectedMunicipal(null);
            return;
          }

          if (!contentMap.municipal[d.properties.KnKod]) return;
          const municipalIndex = Object.values(
            contentMap.municipalsByRegion[selectedRegion.properties.LnKod]
              ?.indexMap?.[d.properties.KnKod]
          )[0];

          if (municipalIndex === undefined) return;
          setSelectedIndex(municipalIndex);

          if (windowDimensions.width < 768) onOpen();
        });
    } else {
      svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
    }

    svg.on("click", reset);
  }, [
    regions,
    municipals,
    selectedRegion,
    selectedMunicipal,
    containerWidth,
    windowDimensions.width,
  ]);

  useEffect(() => {
    // Om ingen region är vald eller om det inte finns initiativ för vald region, gör ingenting.
    if (
      !selectedRegion ||
      !contentMap["municipalsByRegion"] ||
      !contentMap["municipalsByRegion"][selectedRegion.properties.LnKod]
    ) {
      return;
    }

    const initiatives =
      contentMap.municipalsByRegion[selectedRegion.properties.LnKod].list;
    const newInitiative = initiatives[selectedIndex];

    if (newInitiative) {
      // Om initiativet inte redan har ett index, lägg till det

      setSelectedInitiative(newInitiative);

      // Uppdatera även selectedMunicipal baserat på initiativets feature_id
      const foundMunicipal = municipals.features.find(
        (municipal) => municipal.properties.KnKod === newInitiative.feature_id
      );

      setSelectedMunicipal(foundMunicipal);
    } else {
      // Om det inte finns något initiativ för det aktuella indexet, nollställ
      if (selectedInitiative || selectedMunicipal) {
        setSelectedInitiative(null);
        setSelectedMunicipal(null);
      }
    }
  }, [
    selectedMunicipal,
    selectedRegion,
    contentMap,
    municipals,
    selectedInitiative,
    selectedIndex,
  ]);
  useEffect(() => {
    //reset zoom on mobile
    if (windowDimensions.width < 768) {
      if (!isOpen) {
        setSelectedRegion(null);
        setSelectedMunicipal(null);
      }
    }
  }, [isOpen]);
  return (
    <>
      <div className="bg-[#EBECFB] grid grid-cols-2 lg:grid-cols-[1fr_1.362fr_1fr] grid-rows-[auto,1fr] md:grid-rows-none h-full  max-h-[100dvh] overflow-hidden">
        <div className="flex flex-row self-start md:hidden col-span-2 px-8 py-5 pt-20 justify-center items-center">
          <div>
            <Button
              className="text-xl text-white bg-[#2337EC] rounded-full"
              onPress={onOpenAxelAll}
            >
              Alla initiativ / regioner
            </Button>
          </div>
          <div className="ml-auto">
            <Button
              className="bg-transparent min-w-0 rounded-full p-0 m-0 w-10 h-10"
              onPress={onOpenChangeAxel}
            >
              <InformationCircleIcon className="w-10 text-[#2337EC]" />
            </Button>
          </div>
        </div>

        <div className="hidden md:flex flex-col justify-start col-start-1 col-span-1 items-start  p-14 overflow-hidden side-panels">
          {/* <div className="px-2">
            <h3 className="text-xl font-medium text-[#2337EC] self-start">INNANFÖRSKAPETS KARTA</h3>

          </div> */}
          {/* Visa innehåll kopplat till vald region/kommun */}
          {selectedRegion &&
            !selectedMunicipal &&
            (contentMap.region[selectedRegion.properties.LnKod] ? (
              <div className="mt-4">
                {(() => {
                  const entry = content.find(
                    (e) => e.feature_id === selectedRegion.properties.LnKod
                  );
                  return (
                    <>
                      <h3 className="text-3xl">{entry.title}</h3>
                      <div className="mt-5">{entry.content}</div>
                    </>
                  );
                })()}
              </div>
            ) : (
              contentMap.municipalsByRegion[
                selectedRegion.properties.LnKod
              ] && (
                <InitiativeSliderList
                  entries={
                    contentMap.municipalsByRegion[
                      selectedRegion.properties.LnKod
                    ].list
                  }
                  sliderRef={sliderRef}
                  sliderState={[selectedIndex, setSelectedIndex]}
                  settings={{
                    arrows: false,
                    dotArrow: true,
                    classNames: { slider: "desktop-slider" },
                  }}
                />
              )
            ))}
          {selectedMunicipal && selectedRegion && selectedInitiative && (
            <InitiativeSliderList
              entries={
                contentMap.municipalsByRegion[selectedRegion.properties.LnKod]
                  .list
              }
              sliderRef={sliderRef}
              sliderState={[selectedIndex, setSelectedIndex]}
              settings={{
                arrows: false,
                classNames: { slider: "slider-wrapper" },
              }}
            />
          )}
          {selectedMunicipal && selectedRegion && !selectedInitiative && (
            <>
              <div className="px-2 flex flex-col mt-0 mb-5">
                <h3
                  className="text-4xl mt-0 break-words break-normal whitespace-normal"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(main.title),
                  }}
                ></h3>

                <div
                  className="text-xl mt-3"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(main.text),
                  }}
                ></div>
              </div>
            </>
          )}
          <div className="mx-2 mt-auto">
            <div className="mt-10 flex flex-col">
              <div className="text-2xl mt-3 max-w-64 leading-6">
                Kartan är i ständig utveckling och ditt bidrag behövs.
              </div>
              {/*framsidan lägg till initiativ*/}
              <Button
                endContent={
                  <ChevronRightIcon className="w-[10px] ml-4 text-white" />
                }
                onPress={handleAddInitiative}
                className="bg-[#2237EC] text-white rounded-full px-8 py-3 self-start mt-5 flex flex-row"
              >
                <span className="ml-4">Lägg till initiativ</span>
              </Button>
            </div>
          </div>
        </div>
        <div
          ref={mapContainerRef}
          className="flex flex-col col-span-2 h-full md:col-span-1 col-start-1 md:col-start-2 relative justify-start items-center border-none md:border-solid md:border-r md:border-l border-[#2337EC] overflow-hidden"
        >
          <svg
            ref={svgRef}
            className="p-0"
            style={{ width: "100%", height: "100%" }}
          ></svg>
          <div className="mt-4 flex gap-2 absolute bottom-[55px] right-10">
            <button
              className="p-3 bg-[#2337EC] rounded-full text-white"
              onClick={handleZoomIn}
            >
              <PlusIcon className="w-5" />
            </button>
            <button
              className="p-3 bg-[#2337EC] rounded-full text-white"
              onClick={handleZoomOut}
            >
              <MinusIcon className="w-5" />
            </button>
          </div>
        </div>
        <div className="hidden lg:flex flex-col col-start-3 justify-center items-start gap-5 px-14 py-14 overflow-hidden side-panels">
          {selectedRegion &&
          contentMap.municipalsByRegion[selectedRegion.properties.LnKod] ? (
            <div className="right-panel">
              <h3 className="text-4xl">
                {removeLastS(selectedRegion.properties.LnNamn)}
              </h3>

              <VertScroll
                pageLimit={8}
                className="mt-5"
                sliderState={[selectedIndex, setSelectedIndex]}
              >
                {contentMap.municipalsByRegion[
                  selectedRegion.properties.LnKod
                ].list.map((municipal, index) => (
                  <div
                    key={index}
                    className="text-left text-xl font-[400] hover:text-[#223ECF] h-8"
                  >
                    <button
                      onClick={() => handleMunicipalClick(index)}
                      className={`${
                        selectedIndex === index
                          ? "text-[#223ECF] underline-offset-5"
                          : ""
                      } text-left p-0`}
                    >
                      {municipal.title}
                    </button>
                  </div>
                ))}
              </VertScroll>

              <Button
                className="bg-transparent flex flex-row text-black text-xl mx-0 pl-0 mt-5 hover:text-[#2337EC]"
                onPress={handleBackToRegions}
                startContent={
                  <div className="flex mr-1 p-1 flex-row justify-start items-center border-1 border-[#233ECF] rounded-full">
                    <ChevronLeftIcon className="w-3 text-[#233ECF]" />
                  </div>
                }
              >
                Tillbaka till alla regioner
              </Button>
            </div>
          ) : (
            <>
              <h3 className="text-4xl mt-0">Hitta ett initiativ</h3>
              <ul className="grid grid-cols-6 gap-1 w-full">
                {[...regions.features]
                  .sort((a, b) =>
                    a.properties.LnNamn.localeCompare(b.properties.LnNamn)
                  )
                  .map((region) => (
                    <li
                      key={region.properties.LnKod}
                      className="col-span-6 md:col-span-3 text-xl font-[400] text-left hover:text-[#223ECF]"
                    >
                      <button
                        onClick={() => handleRegionClick(region)}
                        className={`${
                          selectedRegion?.properties.LnKod ===
                          region.properties.LnKod
                            ? "underline underline-offset-5"
                            : ""
                        } p-0 text-left`}
                      >
                        {removeLastS(region.properties.LnNamn)}
                      </button>
                    </li>
                  ))}
              </ul>
            </>
          )}
          <div className="flex flex-col w-full align-bottom self-end place-self-end mt-auto">
            <Sponsorer
              classNames={{
                container:
                  "flex flex-row items-center mt-4 text-black fill-black justify-end",
                logos: "max-h-10 text-black fill-black",
              }}
            />
          </div>
        </div>
      </div>

      {windowDimensions.width < 768 && (
        <>
          <AxelssonModal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            scrollBehavior="inside"
            contentClassName="p-0"
            ref={modalRef}
            motionProps={{
              variants: {
                enter: {
                  y: 0,
                  opacity: 1,
                  transition: {
                    duration: 0.3,
                    ease: "easeOut",
                  },
                },
                exit: {
                  y: 600,
                  opacity: 0.7,
                  transition: {
                    duration: 0.3,
                    ease: "easeIn",
                  },
                },
              },
            }}
          >
            <>
              {selectedMunicipal &&
                contentMap.municipalsByRegion[
                  selectedRegion.properties.LnKod
                ] && (
                  <InitiativeSlider
                    ref={sliderRef}
                    sliderState={[selectedIndex, setSelectedIndex]}
                    scrollBehavior="inside"
                    settings={{
                      arrows: false,
                      dotArrow: false,
                      activeColor: "#FFFFFF",
                      inactiveColor: "#8590F3",
                      classNames: {
                        slider: "phone-slider",
                      },
                    }}
                  >
                    {contentMap.municipalsByRegion[
                      selectedRegion.properties.LnKod
                    ].list.map((entry, index) => {
                      return (
                        <MobileInitiativeSlide
                          entry={entry}
                          selectedRegion={selectedRegion}
                          selectedMunicipal={selectedMunicipal}
                          key={index + "_slider"}
                        />
                      );
                    })}
                  </InitiativeSlider>
                )}
            </>
          </AxelssonModal>
          <AxelssonModal
            isOpen={isOpenAxel}
            onOpenChange={onOpenChangeAxel}
            motionProps={{
              variants: {
                enter: {
                  y: 0,
                  opacity: 1,
                  transition: {
                    duration: 0.5,
                    ease: "easeOut",
                  },
                },
                exit: {
                  y: 600,
                  opacity: 1,
                  transition: {
                    duration: 0.4,
                    ease: "easeIn",
                  },
                },
              },
            }}
          >
            <AxelssonModalHeader>
              <div className="text-sm font-normal">Innförskapets karta</div>
            </AxelssonModalHeader>
            <AxelssonModalBody className={" max-h-32"}>
              {main.title && !selectedRegion ? (
                <div className="flex flex-col">
                  <h3
                    className="text-3xl"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(main.title),
                    }}
                  ></h3>
                  <div className="mt-5 text-xl">
                    {DOMPurify.sanitize(main.text)}
                  </div>
                </div>
              ) : (
                selectedRegion &&
                !contentMap.municipalsByRegion[
                  selectedRegion.properties.LnKod
                ] && (
                  <div className="flex flex-col">
                    <h3 className="text-3xl">
                      Var med <br />
                      och forma kartan!
                    </h3>
                    <div className="mt-5 text-xl">
                      För närvarande finns det inget initiativ registrerat på
                      kartan för denna region. Vill du bidra till innanförskapet
                      genom att lägga till ett initiativ?
                      <br />
                      <br />
                      Fyll gärna i vårt formulär!
                    </div>
                    <Button
                      endContent={
                        <ChevronRightIcon className="w-[10px] ml-4 text-[#2237EC]" />
                      }
                      onPress={handleAddInitiativeAndCloseAxel}
                      className="bg-white text-[#2237EC] rounded-full px-8 py-3 self-start mt-5 flex flex-row text-small"
                    >
                      <span className="ml-4">Lägg till initiativ</span>
                    </Button>
                  </div>
                )
              )}
            </AxelssonModalBody>
            <AxelssonModalFooter>
              <Sponsorer
                classNames={{
                  container:
                    "flex flex-row items-center mt-4 text-white fill-white justify-end",
                  logos: "max-h-10 text-white fill-white",
                }}
              />
            </AxelssonModalFooter>
          </AxelssonModal>
          <AxelssonModal
            isOpen={isOpenAxelAll}
            onOpenChange={onOpenChangeAxelAll}
            size="full"
            motionProps={{
              variants: {
                enter: {
                  y: 0,
                  opacity: 1,
                  transition: {
                    duration: 0.3,
                    ease: "easeOut",
                  },
                },
                exit: {
                  y: 600,
                  opacity: 0.7,
                  transition: {
                    duration: 0.3,
                    ease: "easeIn",
                  },
                },
              },
            }}
          >
            <AxelssonModalHeader>
              <div className="text-sm font-normal">Innförskapets karta</div>
            </AxelssonModalHeader>
            <AxelssonModalBody className="mb-5 mt-0 pt-0 max-h-32">
              <div className="flex flex-row flex-nowrap gap-2">
                <Button
                  radius="none"
                  className="bg-transparent text-white flex flex-col w-full text-left justify-start gap-0 items-start max-h-none h-auto px-0 pb-4 border-b-0 border-white"
                  onPress={handleSearchRegionToggle}
                >
                  <span className="text-xs">Regioner</span>
                  <span className="text-xl leading-6 font-medium flex flex-row w-full justify-center items-center">
                    <span>Alla regioner</span>
                    {search.type !== "content" && search.show ? (
                      <ChevronUpIcon className="w-7 ml-auto" />
                    ) : (
                      <ChevronDownIcon className="w-7 ml-auto" />
                    )}
                  </span>
                </Button>

                <Button
                  radius="none"
                  className="bg-transparent text-white flex flex-col w-full text-left justify-start gap-0 items-start max-h-none h-auto px-0 pb-4  border-b-0 border-white"
                  onPress={handleSearchContentToggle}
                >
                  <span className="text-xs">Initiativ</span>
                  <span className="text-xl leading-6 font-medium flex flex-row w-full justify-center items-center">
                    <span>Alla initiativ</span>
                    {search.type === "content" && search.show ? (
                      <ChevronUpIcon className="w-7 ml-auto" />
                    ) : (
                      <ChevronDownIcon className="w-7 ml-auto" />
                    )}
                  </span>
                </Button>
              </div>
              <div className="flex flex-col h-full overflow-hidden">
                {search && search.show ? (
                  <>
                    <ScrollBox className="mt-5" mask maskHeight={50}>
                      <SearchList
                        type={search.type}
                        regions={regions}
                        content={content}
                        onRegionClick={handleAllRegionsModalRegionClick}
                        onInitiativeClick={handleAllRegionsModalInitiativeClick}
                      />
                    </ScrollBox>
                  </>
                ) : (
                  <div className="mt-auto">
                    <span className="text-base mt-5">
                      Skicka in ditt initiativ
                    </span>
                    <h4 className="text-3xl">
                      Kartan är i ständig utveckling och ditt bidrag behövs.
                    </h4>

                    <Button
                      className="bg-white text-blue-800 rounded-full px-6 py-3 self-start mt-5"
                      onPress={handleAddInitiativeAndCloseAxelAll}
                    >
                      Till formuläret
                    </Button>
                  </div>
                )}
              </div>
            </AxelssonModalBody>
            <AxelssonModalFooter>
              <Sponsorer />
            </AxelssonModalFooter>
          </AxelssonModal>
        </>
      )}
    </>
  );
};

export default SwedenMap;
