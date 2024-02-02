import React, { useState } from "react";
import Cards from "./Cards";
import { list } from "../data";
import { FaSearch } from "react-icons/fa";

interface DetailsProps {
  handleClick: (item: any) => void;
}

function Details({ handleClick }: DetailsProps) {
  const [category, setCategory] = useState(list);
  const [activeTab, setActiveTab] = useState("All");
  const [showDropdown, setShowDropdown] = useState(false);

  //search functionality
  const [query, setQuery] = useState("");

  const handleBtns = (word: string) => {
    if (word === "All") {
      setCategory(list);
    } else {
      const filtered = list.filter((item) => item.kind === word);
      setCategory(filtered);
    }

    setActiveTab(word);
    setShowDropdown(false);
  };

  const filterItems = [
    "All",
    "Burger",
    "Pizza",
    "Boxes",
    "Appetizer",
    "Breakfast",
    "Salad & Drinks",
  ];
  return (
    <>
      <section className="container pt-4 mx-auto w-full bg-bgColor">
        <section className="px-6 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-80 h-11 mt-4">
            <input
              type="text"
              onChange={(event) => setQuery(event.target.value)}
              className=" h-full py-4 px-10 text-base text-black rounded-lg outline-none"
              placeholder="Search food..."
            />
            <i>
              <FaSearch className="absolute left-4 top-4 text-lg w-4 h-4 text-center text-black focus:outline-none" />
            </i>
          </div>

          <div className="relative flex items-center">
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 mr-4 h-10 text-center inline-flex items-center bg-brandColor hover:bg-brandColor/80 focus:ring-brandColor/10"
              type="button"
            >
              Filters
            </button>
            <div
              className={`z-10 bg-gray-700 divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute top-[3rem] ${
                showDropdown ? "" : "hidden"
              }`}
            >
              <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                {filterItems.map((filterItem) => (
                  <li
                    key={filterItem}
                    value={filterItem}
                    onClick={() => handleBtns(filterItem)}
                    className={`hover:bg-brandColor cursor-pointer px-2 ${
                      activeTab === filterItem
                        ? "bg-brandColor outline-none text-white"
                        : ""
                    }`}
                  >
                    {filterItem}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="flex flex-row flex-wrap">
          {category
            .filter((title) => {
              if (query === "") {
                return title;
              } else if (
                title.title.toLowerCase().includes(query.toLowerCase())
              ) {
                return title;
              }
              return null;
            })
            .map((item) => (
              <Cards key={item.id} item={item} handleClick={handleClick} />
            ))}
        </section>
      </section>
    </>
  );
}

export default Details;
