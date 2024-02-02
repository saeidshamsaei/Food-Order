import SideBar from "../Components/SideBar";
import { FaInstagram } from "react-icons/fa";

const About = () => {
  return (
    <>
      <SideBar />
      <section className="w-full container flex flex-col justify-center ml-24">
        <div className="flex flex-col gap-2 text-center sm:[&>p]:text-start ">
          <h1 className="font-bold text-2xl my-4 text-brandColor">
            About Majara Food
          </h1>
          <p className="text-white">
            Welcome to our restaurant, where passion for food meets a warm and
            inviting atmosphere. At Majara, we believe that dining is not just
            about nourishment, but also about creating memorable experiences.
          </p>
          <p className="text-white">
            Our team of talented chefs is dedicated to crafting exquisite dishes
            using only the freshest and finest ingredients. We take pride in
            offering a diverse menu that caters to various tastes and dietary
            preferences.
          </p>
          <p className="text-white">
            But it's not just the food that sets us apart. Our friendly and
            attentive staff is committed to providing exceptional service,
            ensuring that every visit is met with a smile and a dining
            experience to remember.
          </p>
          <p className="text-white">
            Whether you're joining us for a romantic dinner, a family
            celebration, or a casual get-together with friends, we strive to
            create an ambiance that makes you feel right at home.
          </p>
          <p className="text-white">
            Thank you for choosing Majara. We look forward to serving you and
            making your time with us truly special.
          </p>
        </div>
        <div className="p-2 w-full pt-8 mt-8 border-t border-gray-200 text-center">
          <a href="mailto:MajaraFood@email.com" className="text-brandColor">
            MajaraFood@email.com
          </a>
          <p className="leading-normal my-5 text-white">
            Moalem 7 , shariati St.
            <br />
            Babol , Iran
          </p>
          <span className="inline-flex">
            <a
              className="text-brandColor cursor-pointer"
              href="www.instagram.com"
              target="_blank"
            >
              <FaInstagram className="w-6 h-6" />
            </a>
          </span>
        </div>
      </section>
    </>
  );
};

export default About;
