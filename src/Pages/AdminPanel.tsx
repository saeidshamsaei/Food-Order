import React, { useState, useEffect, useCallback } from "react";
import { FaTrash } from "react-icons/fa";

interface Order {
  id: number;
  title: string;
  amount: number;
  price: number;
  img: string;
}

interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  orders: Order[] | string;
  tableNumber: number;
  orderNumber: number;
  status: OrderStatus;
  orderTime: string;
  orderPrice: number;
}

enum OrderStatus {
  SUBMITTED = "Submitted",
  PENDING = "Pending",
  EATING = "Eating",
  FINISHED = "Finished",
}

const renderOrdersTable = (orders: Order[]) => (
  <div className="max-w-full">
    <table className="min-w-full border-collapse">
      <thead>
        <tr>
          <th className="py-1 px-1">Orders</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td className="py-1 px-1 whitespace-nowrap break-all">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-1">
                  <span className="font-bold min-w-[20ch]">{order.title}</span>
                  <span>Amount: {order.amount}</span>
                  <span>Price: {order.price.toLocaleString()}</span>
                </div>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const AdminPanel = () => {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<string>("all");

  const fetchOrders = useCallback(async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching user data: ${response.statusText}`);
      }
      const data: UserData[] = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  const handleStatusChange = async (userId: string, newStatus: OrderStatus) => {
    const token = localStorage.getItem("token");

    try {
      if (newStatus === OrderStatus.FINISHED) {
        const user = userData.find((user) => user._id === userId);
        // console.log(user);
        if (user) {
          const tableNumber = user.tableNumber;
          // console.log(tableNumber);
          // Make an API call to free up the table
          const freeTableResponse = await fetch(
            `http://localhost:5000/api/orders/table/${tableNumber}/free`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!freeTableResponse.ok) {
            throw new Error(
              `Error freeing up table number: ${freeTableResponse.statusText}`
            );
          }
        }
      }

      // Update the order status on the server
      const response = await fetch(
        `http://localhost:5000/api/orders/${userId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error updating order status: ${response.statusText}`);
      }
      // Fetch updated user data after status change
      const updatedUser = await response.json();
      // Update userData state with the new user data
      setUserData((prevUserData) =>
        prevUserData.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleDeleteRow = async (userId: string) => {
    const token = localStorage.getItem("token");

    try {
      // Make an API call to delete the order
      const response = await fetch(
        `http://localhost:5000/api/orders/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error deleting order: ${response.statusText}`);
      }

      // Remove the deleted user from the state
      setUserData((prevUserData) =>
        prevUserData.filter((user) => user._id !== userId)
      );

      console.log("Order deleted successfully");
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const calculateTotalPrice = (orders: Order[] | UserData[]) => {
    // Logic to calculate total price
    let totalPrice = 0;
  
    for (const order of orders) {
      if ('price' in order) {
        // It's an Order
        totalPrice += order.price * order.amount;
      } else {
        // It's a UserData
        totalPrice += order.orderPrice;
      }
    }
  
    return totalPrice;
  };
  

  useEffect(() => {
    // Fetch user data from the server initially
    fetchOrders();

    // Set up interval to periodically fetch user data
    const intervalId = setInterval(fetchOrders, 10000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [fetchOrders]);

  return (
    <div className="text-white p-8">
      <h2 className="text-3xl mb-4 font-bold flex justify-center">
        Order Data
      </h2>
      <div className="flex">
        <label htmlFor="orderStatus" className="text-sm font-bold mt-2">
          Choose order status :
        </label>
        <select
          id="orderStatus"
          className="ml-2 appearance-none w-20% bg-gray-200 border border-gray-200 text-gray-700 py-2 px-3  pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          onChange={(e) => setSelectedOrderStatus(e.target.value)}
        >
          <option value="all">All Orders</option>
          {Object.values(OrderStatus).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <p className="mt-1 ml-3 text-lg font-bold">
          Total Order Price: {calculateTotalPrice(userData).toLocaleString()}
        </p>
      </div>

      {selectedOrderStatus === "all" ? (
        <table className="w-full divide-y-4 divide-gray-200 text-center ">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="py-2 px-3 ">#Order</th>
              <th className="py-2 px-3 ">First Name</th>
              <th className="py-2 px-3 ">Last Name</th>
              <th className="py-2 px-3 ">Orders</th>
              <th className="py-2 px-3 ">OrderPrice</th>
              <th className="py-2 px-3 ">Table Number</th>
              <th className="py-2 px-3 ">Order Status</th>
              <th className="py-2 px-3 ">Action</th>
              <th className="py-2 px-3 ">Order Time</th>
              <th className="py-2 px-3 ">Delete</th>
            </tr>
          </thead>
          <tbody className="bg-gray-700 text-gray-300 divide-y">
            {userData.map((user) => (
              <tr key={user._id}>
                <td className="py-2 px-3 ">{user.orderNumber}</td>
                <td className="py-2 px-3 ">{user.firstName}</td>
                <td className="py-2 px-3 ">{user.lastName}</td>
                <td className="py-2 px-3 ">
                  {Array.isArray(user.orders)
                    ? renderOrdersTable(user.orders)
                    : "No orders"}
                </td>
                <td className="py-2 px-3 ">
                  {user.orderPrice.toLocaleString()}
                </td>
                <td className="py-2 px-3 ">{user.tableNumber}</td>
                <td className="py-2 px-3 ">{user.status}</td>
                <td className="py-2 px-3 ">
                  <select
                    value={user.status}
                    onChange={(e) =>
                      handleStatusChange(
                        user._id,
                        e.target.value as OrderStatus
                      )
                    }
                    className="border border-gray-300 rounded-md bg-slate-500 py-1 px-2 focus:outline-none focus:border-blue-500"
                  >
                    {Object.values(OrderStatus).map((status) => (
                      <option
                        key={status}
                        value={status}
                        className="capitalize"
                      >
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-2 px-3 ">{user.orderTime}</td>
                <td className="py-2 px-3">
                  <button
                    onClick={() => handleDeleteRow(user._id)}
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <table className="w-full divide-y-4 divide-gray-200 text-center ">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="py-2 px-3 ">#Order</th>
              <th className="py-2 px-3 ">First Name</th>
              <th className="py-2 px-3 ">Last Name</th>
              <th className="py-2 px-3 ">Orders</th>
              <th className="py-2 px-3 ">OrderPrice</th>
              <th className="py-2 px-3 ">Table Number</th>
              <th className="py-2 px-3 ">Order Status</th>
              <th className="py-2 px-3 ">Action</th>
              <th className="py-2 px-3 ">Order Time</th>
              <th className="py-2 px-3 ">Delete</th>
            </tr>
          </thead>
          <tbody className="bg-gray-700 text-gray-300 divide-y">
            {userData
              .filter((user) => user.status === selectedOrderStatus)
              .map((user) => (
                <tr key={user._id}>
                  <td className="py-2 px-3 ">{user.orderNumber}</td>
                  <td className="py-2 px-3 ">{user.firstName}</td>
                  <td className="py-2 px-3 ">{user.lastName}</td>
                  <td className="py-2 px-3 ">
                    {Array.isArray(user.orders)
                      ? renderOrdersTable(user.orders)
                      : "No orders"}
                  </td>
                  <td className="py-2 px-3 ">
                    {user.orderPrice.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 ">{user.tableNumber}</td>
                  <td className="py-2 px-3 ">{user.status}</td>
                  <td className="py-2 px-3 ">
                    <select
                      value={user.status}
                      onChange={(e) =>
                        handleStatusChange(
                          user._id,
                          e.target.value as OrderStatus
                        )
                      }
                      className="border border-gray-300 bg-slate-500 rounded-md py-1 px-2 focus:outline-none focus:border-blue-500"
                    >
                      {Object.values(OrderStatus).map((status) => (
                        <option
                          key={status}
                          value={status}
                          className="capitalize"
                        >
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 px-3 ">{user.orderTime}</td>
                  <td className="py-2 px-3">
                    <button
                      onClick={() => handleDeleteRow(user._id)}
                      className="text-red-500 hover:text-red-700 focus:outline-none"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPanel;
