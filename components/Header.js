import Link from "next/link";
import React from "react";

const Header = ({ user, handleLogout, setnavBar, navbar }) => {
  return (
    <>
      <header className="">
        <div className="header__left">
          
        </div>

        <div className="header__right">
          <div className="fn__nav_bar">
            <div className="bar__item bar__item_user">
              {user && user.email ? (
                <Link
                  onClick={(e) => {
                    e.preventDefault();
                    setnavBar((prev) => !prev);
                  }}
                  href="/"
                  className="user_opener fn__tooltip"
                  title="User Profile"
                >
                  <img referrerPolicy="no-referrer" src={user.url} alt="" />
                </Link>
              ) : (
                <Link
                  href="/signin"
                  className="token_upgrade techwave_fn_button"
                >
                  <span>Login</span>
                </Link>
              )}
              <div
                style={{
                  opacity: !navbar ? "0" : "1",
                  visibility: !navbar ? "hidden" : "visible",
                }}
                className="item_popup"
                data-position="right"
              >
                <div className="user_profile">
                  {user && user.email && (
                    <div className="user_img">
                      <img referrerPolicy="no-referrer" src={user.url} alt="" />
                    </div>
                  )}
                  {user && user.email && (
                    <div className="user_info">
                      <h2 className="user_name">
                        {user.name}
                        {/* <span>Free</span> */}
                      </h2>
                      <p>
                        <Link
                          href="mailto:tripathiayush23@gmail.com"
                          className="user_email"
                        >
                          {user.email}
                        </Link>
                      </p>
                    </div>
                  )}
                </div>
                <div className="user_nav">
                  <ul>
                    {user && user.email && (
                      <li>
                        <Link href="user-profile.html">
                          <span className="icon">
                            <img
                              src="svg/person.svg"
                              alt=""
                              className="fn__svg"
                            />
                          </span>
                          <span className="text">Profile</span>
                        </Link>
                      </li>
                    )}
                    {user && user.email && (
                      <li>
                        <Link href="/">
                          <span className="icon">
                            <img
                              src="svg/setting.svg"
                              alt=""
                              className="fn__svg"
                            />
                          </span>
                          <span className="text">Settings</span>
                        </Link>
                      </li>
                    )}

                    {user && user.email && (
                      <li>
                        <Link href="" onClick={handleLogout}>
                          <span className="icon">
                            <img
                              src="svg/logout.svg"
                              alt=""
                              className="fn__svg"
                            />
                          </span>
                          <span className="text">Log Out</span>
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
