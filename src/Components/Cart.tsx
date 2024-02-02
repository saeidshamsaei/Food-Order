import React, { useState, useEffect, useCallback } from "react";
import { FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/checkoutBtn.css";

export interface CartItem {
  id: string;
  img: string;
  title: string;
  amount: number;
  price: number;
}

interface CartProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  handleChange: (item: CartItem, value: number) => void;
}

const Cart = ({ cart, setCart, handleChange }: CartProps) => {
  const [price, setPrice] = useState(0);
  let [tableNumber, setTableNumber] = useState<number | null>(null);

  const handleRemove = (id: string) => {
    const arr = cart.filter((item) => item.id !== id);
    setCart(arr);
    handlePrice();
    toast.error("Item removed from cart", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const handlePrice = useCallback(() => {
    let ans = 0;
    cart.forEach((item) => (ans += item.amount * item.price));
    setPrice(ans);
  }, [cart]);

  useEffect(() => {
    handlePrice();
  }, [cart, handlePrice]);

  // let navigate = useNavigate();

  const initializePayment = async (cart: CartItem[]) => {
  const token = localStorage.getItem("token");

  if (tableNumber === null) {
    toast.error("Please enter a table number", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    return;
  }

  try {
    // Check if the selected table is already occupied
    const occupiedOrdersResponse = await fetch(
      `https://food-order-api-eight.vercel.app/api/orders/table/${tableNumber}/occupied`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (occupiedOrdersResponse.ok) {
      const occupiedOrders = await occupiedOrdersResponse.json();
      const userResponse = await fetch("https://food-order-api-eight.vercel.app/api/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error(`Error fetching profile: ${userResponse.statusText}`);
      }

      const userData = await userResponse.json();
      console.log(userData.firstName);
      console.log(occupiedOrders);
      const currentUserOccupied = occupiedOrders.find((order: any) => {
        console.log("Occupied Order:", order);
        return (
          order.firstName === userData.firstName &&
          order.lastName === userData.lastName
        );
      });
      // console.log(currentUserOccupied);

      if (occupiedOrders.length > 0 && !currentUserOccupied) {
        tableNumber = null;
        toast.error("Selected table is already occupied", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return;
      }
    } else {
      toast.error("Please enter a table number", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      })
      console.error(
        "Error checking occupied orders:",
        occupiedOrdersResponse.statusText
      );
      return;
    }

    if (!token) {
      console.error("User not logged in");
      return;
    }

    // Fetch user information
    const userResponse = await fetch("https://food-order-api-eight.vercel.app/api/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error(`Error fetching profile: ${userResponse.statusText}`);
    }

    const userData = await userResponse.json();

    // Prepare order data
    const orderData = {
      client: {
        id: userData.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
      },
      orders: cart.map((item) => ({
        id: item.id,
        title: item.title,
        amount: item.amount,
        price: item.price,
      })),
      tableNumber: tableNumber,
      orderPrice: price + price * 0.09,
    };

    // Send the order to the server
    const orderResponse = await fetch("https://food-order-api-eight.vercel.app/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    if (orderResponse.ok) {
      console.log("Order saved successfully");
      toast.success("Order has been successfully placed!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      window.location.reload();
    } else {
      console.error("Error saving order:", orderResponse.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

  return (
    <>
      <section className="flex flex-col items-center justify-center">
        <section className=" text-white sm:w-3/4">
          {cart.length === 0 ? (
            <div className="flex items-center justify-center mt-10">
              <p className="text-center text-white font-semibold text-xl">
                Nothing in cart yet
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                className="flex flex-col sm:flex-row sm:w-full items-center justify-between py-2 border-b-2"
                key={item.id}
              >
                <div className="flex flex-col sm:flex-row items-center w-80 sm:w-full gap-3">
                  <img src={item.img} alt="" className="w-20 h-16 rounded-lg" />
                  <p
                    className="font-bold sm:w-[25ch] sm:truncate"
                    title={item.title}
                  >
                    {item.title}
                  </p>
                  <span className="text-brandColor py-1.5 px-2.5 rounded-lg">
                    {item.price.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-1.5 bg-slate-600 rounded-lg px-1 h-fit">
                  <button
                    className="px-2.5 hover:bg-red-500 rounded-lg flex items-center justify-center text-lg font-bold  my-1"
                    onClick={() => handleChange(item, -1)}
                  >
                    -
                  </button>
                  <span>{item.amount}</span>
                  <button
                    className="px-2.5 hover:bg-green-500 rounded-lg flex items-center justify-center text-lg font-bold  my-1"
                    onClick={() => handleChange(item, 1)}
                  >
                    +
                  </button>
                  <div className="h-full">
                    <button
                      className="py-2 px-2.5 font-semibold bg-red-100 rounded-lg cursor-pointer text-brandColor hover:text-red-600 h-full"
                      onClick={() => handleRemove(item.id)}
                    >
                      <FaTrash title="Remove from cart" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
          {cart.length > 0 && (
            <>
              <div className="flex justify-between mt-8">
                <span className="text-lg font-semibold">Meal Price :</span>
                <span className="text-lg font-semibold text-brandColor">
                  {price.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between mt-4 border-b-2">
                <span className="text-lg font-semibold">Tax:</span>
                <span className="text-lg font-semibold text-brandColor">
                  {(price * 0.09).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between mt-4 border-b-2">
                <span className="text-xl font-bold">Total Cost :</span>
                <span className="text-xl font-bold text-brandColor">
                  {(price + price * 0.09).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between mt-4 border-b-2">
                <label htmlFor="tableNumber" className="text-lg font-semibold">
                  Table Number:
                </label>
                <input
                  type="number"
                  max={20}
                  min={1}
                  id="tableNumber"
                  value={tableNumber || ""}
                  onChange={(e) => {
                    let value = parseInt(e.target.value, 10);
                    if (value > 20) value = 20;
                    else if (value < 1) value = 1;
                    setTableNumber(value ?? 0);
                  }}
                  className="border-none text-sm pl-2 h-8 w-20 bg-slate-100 text-bgColor border-transparent rounded-lg"
                  placeholder="Table"
                />
              </div>
              <section className="flex justify-between mt-12">
                <button
                  onClick={() => initializePayment(cart)}
                  className="checkout-btn"
                >
                  Checkout
                </button>
              </section>
            </>
          )}
        </section>
      </section>
      <ToastContainer />
    </>
  );
};

export default Cart;
