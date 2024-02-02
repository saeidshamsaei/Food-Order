import { Link } from "react-router-dom";
import "../styles/NotFound.css";
const NotFound = () => {
  return (
    <>
      <section className="container mx-auto flex px-5 py-24 items-center justify-center flex-col">
        <img className="lg:w-2/6 md:w-3/6 w-5/6 mb-10 object-cover object-center rounded" alt="dummy"/>
        <div className="text-center lg:w-2/3 w-full">
          <h1 className="text-4xl mb-4 font-bold text-white">Page Not Found</h1>
          <p className="mb-8 text-white text-2xl">Link you've gone to doesn't exist. Kindly go back to the{" "}
            <span className="back">
              <Link to="/home">main page</Link>
            </span></p>
        </div>
      </section>
    </>
  );
};

export default NotFound;
