import "../styles/button.css";

interface Item {
  title: string;
  price: number;
  img: string;
}

const Cards = ({
  item,
  handleClick,
}: {
  item: Item;
  handleClick: (item: Item) => void;
}) => {
  const { title, price, img } = item;

  return (
    <>
      <section className="flex flex-row px-2 py-4 h-50 text-white w-full bg-bgColor sm:w-1/2 md:w-1/3 lg:w-1/4">
        <div className="p-1 w-full ">
          <div className="border-2 border-gray-200 border-opacity-60 rounded-lg overflow-auto">
            <img
              className="h-1/2 w-full object-cover object-center"
              src={img}
              alt="item"
            />
            <div className="px-3 py-2">
              <h1
                className="text-xl font-bold mb-3 truncate"
                title={item.title}
              >
                {title}
              </h1>
              <div className="flex flex-wrap justify-between mb-2">
                <p className="leading-relaxed mt-4 text-lg">
                  Price : {price.toLocaleString()}
                </p>
                <button
                  onClick={() => handleClick(item)}
                  className="animated-btn"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Cards;
