import ScrollBox from "../ScrollBox";

const AboutMap = () => {
  return (
    <ScrollBox
      className="max-h-[30rem] h-full w-full max-w-[52rem] !pr-10 md:!pr-20"
      mask
      maskHeight={50}
    >
      <div className="text-[2rem] [&>p]:mb-6 [&_a]:text-[#2337EC]">
        <p>
          Innanförskapets karta är ett initiativ från{" "}
          <a
            href="https://axeljohnson-app.vercel.app/axelerate"
            target="_blank"
            rel="noreferrer"
          >
            Axelerate
          </a>{" "}
          och{" "}
          <a href="https://jarvaveckan.se/" target="_blank" rel="noreferrer">
            Stiftelsen Järvaveckan
          </a>
          . Syftet är att samla, synliggöra och sprida kunskap om insatser som
          stärker Sveriges framtid, sammanhållning och konkurrenskraft.
        </p>

        <p>
          Genom att kartlägga pågående initiativ ger kartan en överblick över
          det förändringsarbete som pågår varje dag i hela landet – från lokala
          gräsrotsinitiativ till större strategiska satsningar. Målsättningen är
          att göra det enklare att upptäcka evidensbaserade metoder, möjliggöra
          fler samarbeten med fungerande initiativ och förstå var insatser
          behövs som mest.
        </p>

        <p>
          Kartan är en dynamisk resurs som kontinuerligt uppdateras med nya
          initiativ och lärdomar. Om du arbetar med att öka innanförskapet,
          eller om du känner till ett initiativ som borde finnas med, är du
          välkommen att bidra. Du kan enkelt lägga till ett initiativ via
          formuläret i menyn.
        </p>

        <p>
          Tillsammans kan vi synliggöra lösningar och sprida kunskap, så att
          fler kan vara med och göra skillnad.
        </p>
      </div>
    </ScrollBox>
  );
};

const AddInitiative = () => {
  return (
    <div className="max-h-[30rem] h-full w-full max-w-[52rem] md:!pr-20 text-xl md:text-3xl leading-9">
      Kartan utvecklas ständigt, och vi behöver din hjälp. Arbetar du med att
      öka innanförskapet, eller ser du något som saknas? Sätt det på kartan
      genom att fylla i formuläret.
    </div>
  );
};
const Contact = () => {
  return (
    <div className="max-h-[30rem] h-full w-full max-w-[32rem] !pr-20 text-3xl leading-9">
      <p>
        Om du har frågor om kartan eller ett initiativ, är du välkommen att höra
        av dig.
      </p>
      <a
        href="mailto:info@jarvaveckan.se"
        className="text-[#2337EC] mt-24 flex text-xl md:text-3xl"
      >
        info@jarvaveckan.se
      </a>
    </div>
  );
};
const Initiatives = ({ content }) => {
  return (
    <ScrollBox className="max-h-[30rem] h-full w-full" mask maskHeight={50}>
      <ul className="grid grid-cols-12 gap-y-[1rem]">
        {Object.values(content).map((item) => (
          <li key={item.id} className="col-span-12 md:col-span-6 mr-10">
            <button
              className="text-3xl leading-[2.25rem] text-black text-left"
              disabled
            >
              {item.title}
            </button>
          </li>
        ))}
      </ul>
    </ScrollBox>
  );
};
const MenuPage = ({ pages, setCurrentPage }) => {
  return (
    <ul className="text-[#667085] text-xl gap-[1.5625rem] flex flex-col">
      {pages.map((page) => {
        if (page.id === 0) return null;
        return (
          <li key={page.id} className="">
            <a
              className="text-4xl leading-[2.25rem] text-black hover:text-[#2337EC]"
              href={page.url}
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(page.id);
              }}
            >
              {page.title}
            </a>
          </li>
        );
      })}
    </ul>
  );
};
export { AboutMap, AddInitiative, Contact, Initiatives, MenuPage };
