import React, { useState, useEffect } from "react";
import SideBar from "../Components/SideBar";
import { Link } from "react-router-dom";

const Profile = () => {
  const [userProfile, setUserProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
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
        setUserProfile(data);
      })
      .catch((error) => console.error(error.message));
  }, []);

  return (
    <>
      <SideBar />
      <section className="flex flex-col text-center items-center justify-center sm:mx-auto p-4 mt-10 ml-24 w-full sm:w-1/2 border border-solid border-brandColor rounded-lg">
        <div className="flex flex-col text-white">
          <h1 className="font-bold">Your Profile</h1>
          <p className="mt-2">First Name : {userProfile.firstName}</p>
          <p className="mt-2">Last Name : {userProfile.lastName}</p>
          <p className="mt-2">Email : {userProfile.email}</p>
          <Link to="/settings">
            <button className="animated-btn mt-6">Update profile</button>
          </Link>
        </div>
      </section>
    </>
  );
};

export default Profile;
