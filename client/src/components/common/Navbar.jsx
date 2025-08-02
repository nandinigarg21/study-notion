import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/Logo/Logo-Full-Light.png";
import { NavbarLinks } from "../../data/navbar-links";
import { useLocation } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useSelector } from "react-redux";
import ProfileDropDown from "../core/Auth/ProfileDropDown";
import { categories } from "../../services/apis";
import { useState, useEffect } from "react";
import { apiConnector } from "../../services/apiconnector";
import { BsChevronDown } from "react-icons/bs"


const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItem } = useSelector((state) => state.cart);

  const location = useLocation();

   const [subLinks, setSubLinks] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const result = await apiConnector("GET", categories.CATEGORIES_API)
        setSubLinks(result.data.data)
      } catch (error) {
        console.log("Could not fetch Categories.", error)
      }
      setLoading(false)
    })()
  }, [])


  const matchRoute = (route) => {
    return matchRoute({ path: route }, location.pathname);
  };
  return (
    <div className="flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700">
      <div className="flex justify-between items-center w-11/12 max-w-maxContent">
        {/*Image*/}
        <Link to="/">
          <img src={logo} alt="logo" height={32} width={150} loading="lazy" />
        </Link>

        {/*Links*/}
        <nav>
          <ul className="flex gap-6 text-richblack-5">
            {NavbarLinks.map((link, index) => {
              return (
                <li key={index}>
                  {link.title === "catalog" ? (
                    <div className="relative flex items-center gap-2 group">
                    <p>{link.title}</p>
                   <BsChevronDown />
                   <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                    <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5">

                    </div>

                    {
                      subLinks.length  ? (
                        subLinks.map( (subLink, index) => (
                          <Link to={`${subLink, link}`} key={index}>
                            <p>{subLink.title}</p>
                          </Link>
                        ))

                      ) : (<div></div>)
                    }
                   </div>


                    
                    
                    </div>
                  ) : (
                    <Link to={link?.path}>
                      <p>{link.title}</p>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/*login/signup/dashboard*/}
        <div className="flex gap-x-4 items-center">
          {user && user?.accountType != "Instructor" && (
            <Link to="/dashboard" className="relative">
              <FaShoppingCart />
              {totalItem > 0 && <span>{totalItem}</span>}
            </Link>
          )}
          {token === null && (
            <Link to="/login">
              <button className="border border-richblack-700 text-richblack-100  px-[12px] py-2[8px] rounded-md bg-richblack-800 ">
                Log in
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button className="border border-richblack-700 text-richblack-100  px-[12px] py-2[8px] rounded-md bg-richblack-800">
                Sign up
              </button>
            </Link>
          )}
          {token !== null && <profileDropDown />}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
