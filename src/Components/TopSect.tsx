import { FaShoppingCart } from "react-icons/fa";
import { FaPizzaSlice } from "react-icons/fa";
import { useState, useEffect } from "react";

function TopSect({
  setShow,
  size,
}: {
  setShow: (value: boolean) => void;
  size: number;
}) {

  const [username, setFirstName] = useState({
    firstName:"",
  });


  useEffect(() => {
    const token = localStorage.getItem("token");
    // console.log("Tokenn profile page:", token);
    if (!token) {
      console.error("User not logged in");
      return;
    }
    fetch("https://food-order-api-eight.vercel.app/api/profile", {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          console.log("hi bitch");
          throw new Error(`Error fetching profile: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        // console.log("hi baby");
        // console.log(data);
        setFirstName(data);
        // console.log(data);
      })
      .catch((error) => console.error(error.message));
  }, []);

  return (
    <>
      <div className="flex justify-between items-center px-3 py-2 text-white sticky top-0 w-full z-50 bg-bgColor shadow-lg rounded-lg border-bgColor">
        <div className="flex justify-center items-center">
          <p className="font-semibold text-base">Hello {username.firstName} 👋</p>
        </div>

        <div className="flex my-4 justify-center">
          <span
            className="hover:text-brandColor text-xl cursor-pointer mr-4"
            onClick={() => setShow(true)}
          >
            <FaPizzaSlice className="text-2xl " />
          </span>
          <span
            className="hover:text-brandColor text-xl cursor-pointer flex"
            onClick={() => setShow(false)}
          >
            <FaShoppingCart className="text-2xl " />
            <p className=" ml-1">{size}</p>
          </span>
        </div>
      </div>
    </>
  );
}

export default TopSect;
