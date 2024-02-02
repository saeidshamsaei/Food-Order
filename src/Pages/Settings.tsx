import { useState, useEffect } from "react";
import { useNavigate} from "react-router-dom";
import SideBar from "../Components/SideBar";
import { RxPerson } from "react-icons/rx";

const Settings = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();
  // const location = useLocation();

  useEffect(() => {
    // Fetch user data from the server
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://food-order-ochre.vercel.app/api/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error fetching user data: ${response.statusText}`);
        }

        const userData = await response.json();
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
        setEmail(userData.email);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://food-order-ochre.vercel.app/api/update-profile", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, email }),
      });
  
      if (!response.ok) {
        throw new Error(`Error updating profile: ${response.statusText}`);
      }
  
      console.log("Profile updated successfully!");
  
      // Redirect to the profile page or any other page as needed
      navigate("/profile");
    } catch (error) {
      console.log(error);
    }
  };
  

  return (
    <>
      <SideBar />
      <form
        className="flex flex-col justify-center mx-auto sm:pl-0 pl-10 text-white"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col justify-center mt-8 mb-3 ml-10 gap-y-4 sm:mx-auto">
          <div className="flex flex-col items-center gap-2 overflow-hidden">
            <div className="w-[8rem] h-[8rem] overflow-hidden bg-[#efeeee] rounded-full relative flex items-end justify-center">
              <RxPerson className="w-[80%] h-[80%] text-[gray]/[0.5]" />
            </div>
            <p>Update your profile</p>
          </div>
        </div>
        <div className="flex flex-col gap-y-8 w-[80%] sm:flex-row gap-4 sm:full">
          <div className="">
            <label htmlFor="firstName" className="font-[500] mb-2 ml-1">
              First Name
            </label>
            <div className="w-18 sm:w-32">
              <input
                className="border-none text-sm pl-2 h-12 w-[100%] bg-[#efeeee]/[0.5] border-transparent rounded-lg"
                type="text"
                placeholder="Enter your First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="lastName" className="font-[500] mb-2 ml-1">
              Last Name
            </label>
            <div className="w-18 sm:w-32">
              <input
                className="border-none text-sm pl-2 h-12 w-[100%] bg-[#efeeee]/[0.5] border-transparent rounded-lg"
                type="text"
                placeholder="Enter your Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center mt-8 mb-10">
          <label htmlFor="email" className="font-[500] mb-2 ml-1">
            Email Address
          </label>
          <div className="w-[100%]">
            <input
              className="border-none text-sm pl-2 h-12 w-[100%] bg-[#efeeee]/[0.5] border-transparent rounded-lg"
              type="email"
              placeholder="sample@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <button
          type="submit"
          className="animated-btn px-[6rem] mx-auto py-[0.9rem] bg-brnadColor text-white rounded-[5px] flex"
        >
          Apply profile settings
        </button>
      </form>
    </>
  );
};

export default Settings;
