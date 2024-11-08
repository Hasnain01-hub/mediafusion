import { useRouter } from "next/router";
import React from "react";
import Header from "../components/Header";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { useSelector } from "react-redux";
import { auth } from "../utils/Firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Image = () => {
  const route = useRouter();
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const reduxDispatch = useDispatch();
  const [navbar, setnavBar] = React.useState(false);
  const handleLogout = async (e) => {
    e.preventDefault();
    await auth
      .signOut()
      .then(async () => {
        window.localStorage.removeItem("cart");
        reduxDispatch(logoutSuccess({}));
        toast.success("Logout Success");
        window.location.href = "/";
        dispatch({
          type: "REMOVE_FROM_CART",
          payload: [],
        });

        // setInterval(() => {
        //   window.location.reload();
        // }, 1000);
      })
      .catch((error) => {
        console.log(error.message);
      });
    window.location.reload();
  };
  return (
    <>
      <div>
        <div className="techwave_fn_fixedsub">
          <ul></ul>
        </div>

        <div className="techwave_fn_wrapper fn__has_sidebar">
          <div className="techwave_fn_wrap">
            <div className="techwave_fn_searchbar">
              <div className="search__bar">
                <input
                  className="search__input"
                  type="text"
                  placeholder="Search here..."
                />
                <img
                  src="svg/search.svg"
                  alt=""
                  className="fn__svg search__icon"
                />
                <Link className="search__closer" href="/">
                  <img src="svg/close.svg" alt="" className="fn__svg" />
                </Link>
              </div>
              <div className="search__results">
                <div className="results__title">Results</div>
                <div className="results__list">
                  <ul>
                    <li>
                      <Link href="/">Artificial Intelligence</Link>
                    </li>
                    <li>
                      <Link href="/">
                        Learn about the impact of AI on the financial industry
                      </Link>
                    </li>
                    <li>
                      <Link href="/">
                        Delve into the realm of AI-driven manufacturing
                      </Link>
                    </li>
                    <li>
                      <Link href="/">
                        Understand the ethical implications surrounding AI
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <Header
              user={user}
              handleLogout={handleLogout}
              setnavBar={setnavBar}
              navbar={navbar}
            />

            <div className="techwave_fn_leftpanel">
              <div className="mobile_extra_closer"></div>

              <div className="leftpanel_logo">
                <Link
                  href="/"
                  // onClick={() => {
                  //   route.push("/");
                  // }}
                  className="fn_logo"
                >
                  <span className="full_logo">
                    <img
                      src="images/CCPD_Text.png"
                      alt=""
                      className="desktop_logo"
                    />
                    <img
                      src="images/CCPD_Text.png"
                      alt=""
                      className="retina_logo"
                      onClick={() => {
                        route.push("/");
                      }}
                    />
                  </span>
                  <span className="short_logo">
                    <img
                      src="images/CCPD_Text.png"
                      alt=""
                      className="desktop_logo"
                    />
                    <img
                      src="images/CCPD_Text.png"
                      alt=""
                      className="retina_logo"
                    />
                  </span>
                </Link>
                <Link
                  href="/"
                  className="fn__closer fn__icon_button desktop_closer"
                >
                  <img src="svg/arrow.svg" alt="" className="fn__svg" />
                </Link>
                <Link
                  href="/"
                  className="fn__closer fn__icon_button mobile_closer"
                >
                  <img src="svg/arrow.svg" alt="" className="fn__svg" />
                </Link>
              </div>

              <div className="leftpanel_content">
                <div className="nav_group">
                  <h2 className="group__title">Start Here</h2>
                  <ul className="group__list">
                    <li>
                      <Link
                        href="/"
                        // onClick={() => {
                        //   route.push("/");
                        // }}
                        className="fn__tooltip menu__item"
                        data-position="right"
                        title="Home"
                      >
                        <span className="icon">
                          <img src="svg/home.svg" alt="" className="fn__svg" />
                        </span>
                        <span className="text">Home</span>
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="nav_group">
                  <h2 className="group__title">User Tools</h2>
                  <ul className="group__list">
                    <li>
                      <Link
                        href="/image"
                        className="fn__tooltip active menu__item"
                        data-position="right"
                        title="Image Generation"
                      >
                        <span className="icon">
                          <img src="svg/image.svg" alt="" className="fn__svg" />
                        </span>
                        <span className="text">Image Generation</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/ai"
                        className="fn__tooltip menu__item"
                        data-position="right"
                        title="AI Chat Bot"
                      >
                        <span className="icon">
                          <img src="svg/chat.svg" alt="" className="fn__svg" />
                        </span>
                        <span className="text">AI Chat Bot</span>
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="nav_group">
                  <h2 className="group__title">Support</h2>
                  <ul className="group__list">
                    <li>
                      <Link
                        href="sign-in.html"
                        className="fn__tooltip menu__item"
                        data-position="right"
                        title="Log Out"
                      >
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
                  </ul>
                </div>
              </div>
            </div>

            <div className="techwave_fn_content">
              <div className="techwave_fn_page">
                <div className="techwave_fn_image_generation_page">
                  <div className="generation__page">
                    <div className="generation_header">
                      <div className="header_top">
                        <h1 className="title">Image Generation</h1>
                        <div className="setup">
                          <p className="info">
                            This wil use <span className="count">4</span> tokens
                          </p>
                          <Link href="/" className="sidebar__trigger">
                            <img
                              src="svg/option.svg"
                              alt=""
                              className="fn__svg"
                            />
                          </Link>
                        </div>
                      </div>
                      <div className="header_bottom">
                        <div className="include_area">
                          <textarea
                            id="fn__include_textarea"
                            rows="1"
                          ></textarea>
                          <textarea
                            className="fn__hidden_textarea"
                            rows="1"
                            tabindex="-1"
                          ></textarea>
                        </div>
                        <div className="exclude_area">
                          <textarea
                            id="fn__exclude_textarea"
                            rows="1"
                          ></textarea>
                          <textarea
                            className="fn__hidden_textarea"
                            rows="1"
                            tabindex="-1"
                          ></textarea>
                        </div>
                        <div className="generate_section">
                          <label className="fn__toggle">
                            <span className="t_in">
                              <input
                                type="checkbox"
                                checked
                                id="negative_prompt"
                              />
                              <span className="t_slider"></span>
                              <span className="t_content"></span>
                            </span>
                            Negative Prompt
                          </label>
                          <Link
                            id="generate_it"
                            href="/"
                            className="techwave_fn_button"
                          >
                            <span>Generate</span>
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="generation_history">
                      <div className="fn__generation_item">
                        <div className="item_header">
                          <div className="title_holder">
                            <h2 className="prompt_title">
                              Frozen Glacial Mystical spiral Lighthouse, a
                              minimalist lighthouse landscape with a mystical ,
                              Watercolor Clipart, comic, strybk, full
                              Illustration, 4k, sharp focus, watercolor, smooth
                              soft skin, symmetrical, soft lighting, detailed
                              face, concept art, muted colors
                            </h2>
                            <p className="negative_prompt_title">
                              Negative prompt: Text, watermarks, off centre,
                              blur, low res, out of frame, cut off, ugly
                            </p>
                          </div>
                          <div className="item_options">
                            <div className="fn__icon_options medium_size align_right">
                              <Link href="/" className="fn__icon_button">
                                <img
                                  src="svg/info.svg"
                                  alt=""
                                  className="fn__svg"
                                />
                              </Link>
                              <div className="fn__icon_popup">
                                <ul>
                                  <li>
                                    <span className="text">ArtShaper v3</span>
                                  </li>
                                  <li>
                                    <span className="text">512 x 512px</span>
                                  </li>
                                  <li>
                                    <span className="text">March 15, 2023</span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div className="fn__icon_options medium_size align_right">
                              <Link href="/" className="fn__icon_button">
                                <span className="dots"></span>
                              </Link>
                              <div className="fn__icon_popup">
                                <ul>
                                  <li>
                                    <Link href="/">Copy Prompt</Link>
                                  </li>
                                  <li>
                                    <Link href="/">Reuse Prompt</Link>
                                  </li>
                                  <li>
                                    <Link href="/">Upscale All</Link>
                                  </li>
                                  <li>
                                    <Link href="/">Download All</Link>
                                  </li>
                                  <li className="high_priorety">
                                    <Link href="/">Delete All</Link>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="item_list">
                          <ul className="fn__generation_list">
                            <li className="fn__gl_item">
                              <div className="fn__gl__item">
                                <div className="abs_item">
                                  <img src="images/gallery/1.jpg" alt="" />
                                  <div className="all_options">
                                    <div className="fn__icon_options medium_size">
                                      <Link
                                        href="/"
                                        className="fn__icon_button"
                                      >
                                        <img
                                          src="svg/download.svg"
                                          alt=""
                                          className="fn__svg"
                                        />
                                      </Link>
                                      <div className="fn__icon_popup">
                                        <ul>
                                          <li>
                                            <Link href="/">Original Image</Link>
                                          </li>
                                          <li>
                                            <Link href="/">
                                              Creative Upscaled Image
                                            </Link>
                                          </li>
                                          <li>
                                            <Link href="/">
                                              HD Upscaled Image
                                            </Link>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                    <div className="fn__icon_options medium_size">
                                      <Link
                                        href="/"
                                        className="fn__icon_button"
                                      >
                                        <img
                                          src="svg/upscale.svg"
                                          alt=""
                                          className="fn__svg"
                                        />
                                      </Link>
                                      <div className="fn__icon_popup">
                                        <ul>
                                          <li>
                                            <Link href="/">
                                              Creative Upscale
                                            </Link>
                                          </li>
                                          <li>
                                            <Link href="/">
                                              Alternative Upscale
                                            </Link>
                                          </li>
                                          <li>
                                            <Link href="/">HD Upscale</Link>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                    <div className="fn__icon_options medium_size">
                                      <Link
                                        href="/"
                                        className="fn__icon_button"
                                      >
                                        <span className="dots"></span>
                                      </Link>
                                      <div className="fn__icon_popup">
                                        <ul>
                                          <li>
                                            <Link href="/">
                                              Make Variations
                                            </Link>
                                          </li>
                                          <li className="high_priorety">
                                            <Link href="/">Delete Image</Link>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>
                            <li className="fn__gl_item">
                              <div className="fn__gl__item">
                                <div className="abs_item">
                                  <img src="images/gallery/2.jpg" alt="" />
                                  <div className="all_options">
                                    <div className="fn__icon_options medium_size">
                                      <Link
                                        href="/"
                                        className="fn__icon_button"
                                      >
                                        <img
                                          src="svg/download.svg"
                                          alt=""
                                          className="fn__svg"
                                        />
                                      </Link>
                                      <div className="fn__icon_popup">
                                        <ul>
                                          <li>
                                            <Link href="/">Original Image</Link>
                                          </li>
                                          <li>
                                            <Link href="/">
                                              Creative Upscaled Image
                                            </Link>
                                          </li>
                                          <li>
                                            <Link href="/">
                                              HD Upscaled Image
                                            </Link>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                    <div className="fn__icon_options medium_size">
                                      <Link
                                        href="/"
                                        className="fn__icon_button"
                                      >
                                        <img
                                          src="svg/upscale.svg"
                                          alt=""
                                          className="fn__svg"
                                        />
                                      </Link>
                                      <div className="fn__icon_popup">
                                        <ul>
                                          <li>
                                            <Link href="/">
                                              Creative Upscale
                                            </Link>
                                          </li>
                                          <li>
                                            <Link href="/">
                                              Alternative Upscale
                                            </Link>
                                          </li>
                                          <li>
                                            <Link href="/">HD Upscale</Link>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                    <div className="fn__icon_options medium_size">
                                      <Link
                                        href="/"
                                        className="fn__icon_button"
                                      >
                                        <span className="dots"></span>
                                      </Link>
                                      <div className="fn__icon_popup">
                                        <ul>
                                          <li>
                                            <Link href="/">
                                              Make Variations
                                            </Link>
                                          </li>
                                          <li className="high_priorety">
                                            <Link href="/">Delete Image</Link>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>
                            <li className="fn__gl_item">
                              <div className="fn__gl__item">
                                <div className="abs_item">
                                  <img src="images/gallery/3.jpg" alt="" />
                                  <div className="all_options">
                                    <div className="fn__icon_options medium_size">
                                      <Link
                                        href="/"
                                        className="fn__icon_button"
                                      >
                                        <img
                                          src="svg/download.svg"
                                          alt=""
                                          className="fn__svg"
                                        />
                                      </Link>
                                      <div className="fn__icon_popup">
                                        <ul>
                                          <li>
                                            <Link href="/">Original Image</Link>
                                          </li>
                                          <li>
                                            <Link href="/">
                                              Creative Upscaled Image
                                            </Link>
                                          </li>
                                          <li>
                                            <Link href="/">
                                              HD Upscaled Image
                                            </Link>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                    <div className="fn__icon_options medium_size">
                                      <Link
                                        href="/"
                                        className="fn__icon_button"
                                      >
                                        <img
                                          src="svg/upscale.svg"
                                          alt=""
                                          className="fn__svg"
                                        />
                                      </Link>
                                      <div className="fn__icon_popup">
                                        <ul>
                                          <li>
                                            <Link href="/">
                                              Creative Upscale
                                            </Link>
                                          </li>
                                          <li>
                                            <Link href="/">
                                              Alternative Upscale
                                            </Link>
                                          </li>
                                          <li>
                                            <Link href="/">HD Upscale</Link>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                    <div className="fn__icon_options medium_size">
                                      <Link
                                        href="/"
                                        className="fn__icon_button"
                                      >
                                        <span className="dots"></span>
                                      </Link>
                                      <div className="fn__icon_popup">
                                        <ul>
                                          <li>
                                            <Link href="/">
                                              Make Variations
                                            </Link>
                                          </li>
                                          <li className="high_priorety">
                                            <Link href="/">Delete Image</Link>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>
                            <li className="fn__gl_item">
                              <div className="fn__gl__item">
                                <div className="abs_item">
                                  <img src="images/gallery/4.jpg" alt="" />
                                  <div className="all_options">
                                    <div className="fn__icon_options medium_size">
                                      <Link
                                        href="/"
                                        className="fn__icon_button"
                                      >
                                        <img
                                          src="svg/download.svg"
                                          alt=""
                                          className="fn__svg"
                                        />
                                      </Link>
                                      <div className="fn__icon_popup">
                                        <ul>
                                          <li>
                                            <Link href="/">Original Image</Link>
                                          </li>
                                          <li>
                                            <Link href="/">
                                              Creative Upscaled Image
                                            </Link>
                                          </li>
                                          <li>
                                            <Link href="/">
                                              HD Upscaled Image
                                            </Link>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                    <div className="fn__icon_options medium_size">
                                      <Link
                                        href="/"
                                        className="fn__icon_button"
                                      >
                                        <img
                                          src="svg/upscale.svg"
                                          alt=""
                                          className="fn__svg"
                                        />
                                      </Link>
                                      <div className="fn__icon_popup">
                                        <ul>
                                          <li>
                                            <Link href="/">
                                              Creative Upscale
                                            </Link>
                                          </li>
                                          <li>
                                            <Link href="/">
                                              Alternative Upscale
                                            </Link>
                                          </li>
                                          <li>
                                            <Link href="/">HD Upscale</Link>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                    <div className="fn__icon_options medium_size">
                                      <Link
                                        href="/"
                                        className="fn__icon_button"
                                      >
                                        <span className="dots"></span>
                                      </Link>
                                      <div className="fn__icon_popup">
                                        <ul>
                                          <li>
                                            <Link href="/">
                                              Make Variations
                                            </Link>
                                          </li>
                                          <li className="high_priorety">
                                            <Link href="/">Delete Image</Link>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="fn__generation_item">
                        <div className="item_header">
                          <div className="title_holder">
                            <h2 className="prompt_title">
                              Frozen Glacial Mystical spiral Lighthouse, a
                              minimalist lighthouse landscape with a mystical ,
                              Watercolor Clipart, comic, strybk, full
                              Illustration, 4k, sharp focus, watercolor, smooth
                              soft skin, symmetrical, soft lighting, detailed
                              face, concept art, muted colors
                            </h2>
                            <p className="negative_prompt_title">
                              Negative prompt: Text, watermarks, off centre,
                              blur, low res, out of frame, cut off, ugly
                            </p>
                          </div>
                          <div className="item_options">
                            <div className="fn__icon_options medium_size align_right">
                              <Link href="/" className="fn__icon_button">
                                <img
                                  src="svg/info.svg"
                                  alt=""
                                  className="fn__svg"
                                />
                              </Link>
                              <div className="fn__icon_popup">
                                <ul>
                                  <li>
                                    <span className="text">ArtShaper v3</span>
                                  </li>
                                  <li>
                                    <span className="text">512 x 512px</span>
                                  </li>
                                  <li>
                                    <span className="text">March 15, 2023</span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div className="fn__icon_options medium_size align_right">
                              <Link href="/" className="fn__icon_button">
                                <span className="dots"></span>
                              </Link>
                              <div className="fn__icon_popup">
                                <ul>
                                  <li>
                                    <Link href="/">Copy Prompt</Link>
                                  </li>
                                  <li>
                                    <Link href="/">Reuse Prompt</Link>
                                  </li>
                                  <li>
                                    <Link href="/">Upscale All</Link>
                                  </li>
                                  <li>
                                    <Link href="/">Download All</Link>
                                  </li>
                                  <li className="high_priorety">
                                    <Link href="/">Delete All</Link>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="item_list">
                          <ul className="fn__generation_list">
                            <li className="fn__gl_item">
                              <div className="fn__gl__item">
                                <div className="abs_item">
                                  <img src="images/gallery/5.jpg" alt="" />
                                  <div className="all_options">
                                    <div className="fn__icon_options medium_size">
                                      <Link
                                        href="/"
                                        className="fn__icon_button"
                                      >
                                        <img
                                          src="svg/download.svg"
                                          alt=""
                                          className="fn__svg"
                                        />
                                      </Link>
                                      <div className="fn__icon_popup">
                                        <ul>
                                          <li>
                                            <Link href="/">Original Image</Link>
                                          </li>
                                          <li>
                                            <Link href="/">
                                              Creative Upscaled Image
                                            </Link>
                                          </li>
                                          <li>
                                            <Link href="/">
                                              HD Upscaled Image
                                            </Link>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                    <div className="fn__icon_options medium_size">
                                      <Link
                                        href="/"
                                        className="fn__icon_button"
                                      >
                                        <img
                                          src="svg/upscale.svg"
                                          alt=""
                                          className="fn__svg"
                                        />
                                      </Link>
                                      <div className="fn__icon_popup">
                                        <ul>
                                          <li>
                                            <Link href="/">
                                              Creative Upscale
                                            </Link>
                                          </li>
                                          <li>
                                            <Link href="/">
                                              Alternative Upscale
                                            </Link>
                                          </li>
                                          <li>
                                            <Link href="/">HD Upscale</Link>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                    <div className="fn__icon_options medium_size">
                                      <Link
                                        href="/"
                                        className="fn__icon_button"
                                      >
                                        <span className="dots"></span>
                                      </Link>
                                      <div className="fn__icon_popup">
                                        <ul>
                                          <li>
                                            <Link href="/">
                                              Make Variations
                                            </Link>
                                          </li>
                                          <li className="high_priorety">
                                            <Link href="/">Delete Image</Link>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>
                            <li className="fn__gl_item">
                              <div className="fn__gl__item">
                                <div className="abs_item">
                                  <img src="images/gallery/6.jpg" alt="" />
                                  <div className="all_options">
                                    <div className="fn__icon_options medium_size">
                                      <Link
                                        href="/"
                                        className="fn__icon_button"
                                      >
                                        <img
                                          src="svg/download.svg"
                                          alt=""
                                          className="fn__svg"
                                        />
                                      </Link>
                                      <div className="fn__icon_popup">
                                        <ul>
                                          <li>
                                            <Link href="/">Original Image</Link>
                                          </li>
                                          <li>
                                            <Link href="/">
                                              Creative Upscaled Image
                                            </Link>
                                          </li>
                                          <li>
                                            <Link href="/">
                                              HD Upscaled Image
                                            </Link>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                    <div className="fn__icon_options medium_size">
                                      <Link
                                        href="/"
                                        className="fn__icon_button"
                                      >
                                        <img
                                          src="svg/upscale.svg"
                                          alt=""
                                          className="fn__svg"
                                        />
                                      </Link>
                                      <div className="fn__icon_popup">
                                        <ul>
                                          <li>
                                            <Link href="/">
                                              Creative Upscale
                                            </Link>
                                          </li>
                                          <li>
                                            <Link href="/">
                                              Alternative Upscale
                                            </Link>
                                          </li>
                                          <li>
                                            <Link href="/">HD Upscale</Link>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                    <div className="fn__icon_options medium_size">
                                      <Link
                                        href="/"
                                        className="fn__icon_button"
                                      >
                                        <span className="dots"></span>
                                      </Link>
                                      <div className="fn__icon_popup">
                                        <ul>
                                          <li>
                                            <Link href="/">
                                              Make Variations
                                            </Link>
                                          </li>
                                          <li className="high_priorety">
                                            <Link href="/">Delete Image</Link>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>
                            <li className="fn__gl_item">
                              <div className="fn__gl__item">
                                <div className="abs_item">
                                  <img src="images/gallery/7.jpg" alt="" />
                                  <div className="all_options">
                                    <div className="fn__icon_options medium_size">
                                      <Link
                                        href="/"
                                        className="fn__icon_button"
                                      >
                                        <img
                                          src="svg/download.svg"
                                          alt=""
                                          className="fn__svg"
                                        />
                                      </Link>
                                      <div className="fn__icon_popup">
                                        <ul>
                                          <li>
                                            <Link href="/">Original Image</Link>
                                          </li>
                                          <li>
                                            <Link href="/">
                                              Creative Upscaled Image
                                            </Link>
                                          </li>
                                          <li>
                                            <Link href="/">
                                              HD Upscaled Image
                                            </Link>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                    <div className="fn__icon_options medium_size">
                                      <Link
                                        href="/"
                                        className="fn__icon_button"
                                      >
                                        <img
                                          src="svg/upscale.svg"
                                          alt=""
                                          className="fn__svg"
                                        />
                                      </Link>
                                      <div className="fn__icon_popup">
                                        <ul>
                                          <li>
                                            <Link href="/">
                                              Creative Upscale
                                            </Link>
                                          </li>
                                          <li>
                                            <Link href="/">
                                              Alternative Upscale
                                            </Link>
                                          </li>
                                          <li>
                                            <Link href="/">HD Upscale</Link>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                    <div className="fn__icon_options medium_size">
                                      <Link
                                        href="/"
                                        className="fn__icon_button"
                                      >
                                        <span className="dots"></span>
                                      </Link>
                                      <div className="fn__icon_popup">
                                        <ul>
                                          <li>
                                            <Link href="/">
                                              Make Variations
                                            </Link>
                                          </li>
                                          <li className="high_priorety">
                                            <Link href="/">Delete Image</Link>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>
                            <li className="fn__gl_item">
                              <div className="fn__gl__item">
                                <div className="abs_item">
                                  <img src="images/gallery/8.jpg" alt="" />
                                  <div className="all_options">
                                    <div className="fn__icon_options medium_size">
                                      <Link
                                        href="/"
                                        className="fn__icon_button"
                                      >
                                        <img
                                          src="svg/download.svg"
                                          alt=""
                                          className="fn__svg"
                                        />
                                      </Link>
                                      <div className="fn__icon_popup">
                                        <ul>
                                          <li>
                                            <Link href="/">Original Image</Link>
                                          </li>
                                          <li>
                                            <Link href="/">
                                              Creative Upscaled Image
                                            </Link>
                                          </li>
                                          <li>
                                            <Link href="/">
                                              HD Upscaled Image
                                            </Link>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                    <div className="fn__icon_options medium_size">
                                      <Link
                                        href="/"
                                        className="fn__icon_button"
                                      >
                                        <img
                                          src="svg/upscale.svg"
                                          alt=""
                                          className="fn__svg"
                                        />
                                      </Link>
                                      <div className="fn__icon_popup">
                                        <ul>
                                          <li>
                                            <Link href="/">
                                              Creative Upscale
                                            </Link>
                                          </li>
                                          <li>
                                            <Link href="/">
                                              Alternative Upscale
                                            </Link>
                                          </li>
                                          <li>
                                            <Link href="/">HD Upscale</Link>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                    <div className="fn__icon_options medium_size">
                                      <Link
                                        href="/"
                                        className="fn__icon_button"
                                      >
                                        <span className="dots"></span>
                                      </Link>
                                      <div className="fn__icon_popup">
                                        <ul>
                                          <li>
                                            <Link href="/">
                                              Make Variations
                                            </Link>
                                          </li>
                                          <li className="high_priorety">
                                            <Link href="/">Delete Image</Link>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="fn__generation_item">
                        <div className="item_header">
                          <div className="title_holder">
                            <h2 className="prompt_title">
                              Frozen Glacial Mystical spiral Lighthouse, a
                              minimalist lighthouse landscape with a mystical ,
                              Watercolor Clipart, comic, strybk, full
                              Illustration, 4k, sharp focus, watercolor, smooth
                              soft skin, symmetrical, soft lighting, detailed
                              face, concept art, muted colors
                            </h2>
                            <p className="negative_prompt_title">
                              Negative prompt: Text, watermarks, off centre,
                              blur, low res, out of frame, cut off, ugly
                            </p>
                          </div>
                          <div className="item_options">
                            <div className="fn__icon_options medium_size align_right">
                              <Link href="/" className="fn__icon_button">
                                <img
                                  src="svg/info.svg"
                                  alt=""
                                  className="fn__svg"
                                />
                              </Link>
                              <div className="fn__icon_popup">
                                <ul>
                                  <li>
                                    <span className="text">ArtShaper v3</span>
                                  </li>
                                  <li>
                                    <span className="text">512 x 512px</span>
                                  </li>
                                  <li>
                                    <span className="text">March 15, 2023</span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div className="fn__icon_options medium_size align_right">
                              <Link href="/" className="fn__icon_button">
                                <span className="dots"></span>
                              </Link>
                              <div className="fn__icon_popup">
                                <ul>
                                  <li>
                                    <Link href="/">Copy Prompt</Link>
                                  </li>
                                  <li>
                                    <Link href="/">Reuse Prompt</Link>
                                  </li>
                                  <li>
                                    <Link href="/">Upscale All</Link>
                                  </li>
                                  <li>
                                    <Link href="/">Download All</Link>
                                  </li>
                                  <li className="high_priorety">
                                    <Link href="/">Delete All</Link>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="item_list">
                          <ul className="fn__generation_list">
                            <li className="fn__gl_item">
                              <div className="fn__gl__item">
                                <div className="abs_item">
                                  <img src="images/gallery/1.jpg" alt="" />
                                  <div className="all_options">
                                    <div className="fn__icon_options medium_size">
                                      <Link
                                        href="/"
                                        className="fn__icon_button"
                                      >
                                        <img
                                          src="svg/download.svg"
                                          alt=""
                                          className="fn__svg"
                                        />
                                      </Link>
                                      <div className="fn__icon_popup">
                                        <ul>
                                          <li>
                                            <Link href="/">Original Image</Link>
                                          </li>
                                          <li>
                                            <Link href="/">
                                              Creative Upscaled Image
                                            </Link>
                                          </li>
                                          <li>
                                            <Link href="/">
                                              HD Upscaled Image
                                            </Link>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                    <div className="fn__icon_options medium_size">
                                      <Link
                                        href="/"
                                        className="fn__icon_button"
                                      >
                                        <img
                                          src="svg/upscale.svg"
                                          alt=""
                                          className="fn__svg"
                                        />
                                      </Link>
                                      <div className="fn__icon_popup">
                                        <ul>
                                          <li>
                                            <Link href="/">
                                              Creative Upscale
                                            </Link>
                                          </li>
                                          <li>
                                            <Link href="/">
                                              Alternative Upscale
                                            </Link>
                                          </li>
                                          <li>
                                            <Link href="/">HD Upscale</Link>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                    <div className="fn__icon_options medium_size">
                                      <Link
                                        href="/"
                                        className="fn__icon_button"
                                      >
                                        <span className="dots"></span>
                                      </Link>
                                      <div className="fn__icon_popup">
                                        <ul>
                                          <li>
                                            <Link href="/">
                                              Make Variations
                                            </Link>
                                          </li>
                                          <li className="high_priorety">
                                            <Link href="/">Delete Image</Link>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>
                            <li className="fn__gl_item">
                              <div className="fn__gl__item">
                                <div className="abs_item">
                                  <img src="images/gallery/2.jpg" alt="" />
                                  <div className="all_options">
                                    <div className="fn__icon_options medium_size">
                                      <Link
                                        href="/"
                                        className="fn__icon_button"
                                      >
                                        <img
                                          src="svg/download.svg"
                                          alt=""
                                          className="fn__svg"
                                        />
                                      </Link>
                                      <div className="fn__icon_popup">
                                        <ul>
                                          <li>
                                            <Link href="/">Original Image</Link>
                                          </li>
                                          <li>
                                            <Link href="/">
                                              Creative Upscaled Image
                                            </Link>
                                          </li>
                                          <li>
                                            <Link href="/">
                                              HD Upscaled Image
                                            </Link>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                    <div className="fn__icon_options medium_size">
                                      <Link
                                        href="/"
                                        className="fn__icon_button"
                                      >
                                        <img
                                          src="svg/upscale.svg"
                                          alt=""
                                          className="fn__svg"
                                        />
                                      </Link>
                                      <div className="fn__icon_popup">
                                        <ul>
                                          <li>
                                            <Link href="/">
                                              Creative Upscale
                                            </Link>
                                          </li>
                                          <li>
                                            <Link href="/">
                                              Alternative Upscale
                                            </Link>
                                          </li>
                                          <li>
                                            <Link href="/">HD Upscale</Link>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                    <div className="fn__icon_options medium_size">
                                      <Link
                                        href="/"
                                        className="fn__icon_button"
                                      >
                                        <span className="dots"></span>
                                      </Link>
                                      <div className="fn__icon_popup">
                                        <ul>
                                          <li>
                                            <Link href="/">
                                              Make Variations
                                            </Link>
                                          </li>
                                          <li className="high_priorety">
                                            <Link href="/">Delete Image</Link>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>
                            <li className="fn__gl_item">
                              <div className="fn__gl__item">
                                <div className="abs_item">
                                  <img src="images/gallery/3.jpg" alt="" />
                                  <div className="all_options">
                                    <div className="fn__icon_options medium_size">
                                      <Link
                                        href="/"
                                        className="fn__icon_button"
                                      >
                                        <img
                                          src="svg/download.svg"
                                          alt=""
                                          className="fn__svg"
                                        />
                                      </Link>
                                      <div className="fn__icon_popup">
                                        <ul>
                                          <li>
                                            <Link href="/">Original Image</Link>
                                          </li>
                                          <li>
                                            <Link href="/">
                                              Creative Upscaled Image
                                            </Link>
                                          </li>
                                          <li>
                                            <Link href="/">
                                              HD Upscaled Image
                                            </Link>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                    <div className="fn__icon_options medium_size">
                                      <Link
                                        href="/"
                                        className="fn__icon_button"
                                      >
                                        <img
                                          src="svg/upscale.svg"
                                          alt=""
                                          className="fn__svg"
                                        />
                                      </Link>
                                      <div className="fn__icon_popup">
                                        <ul>
                                          <li>
                                            <Link href="/">
                                              Creative Upscale
                                            </Link>
                                          </li>
                                          <li>
                                            <Link href="/">
                                              Alternative Upscale
                                            </Link>
                                          </li>
                                          <li>
                                            <Link href="/">HD Upscale</Link>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                    <div className="fn__icon_options medium_size">
                                      <Link
                                        href="/"
                                        className="fn__icon_button"
                                      >
                                        <span className="dots"></span>
                                      </Link>
                                      <div className="fn__icon_popup">
                                        <ul>
                                          <li>
                                            <Link href="/">
                                              Make Variations
                                            </Link>
                                          </li>
                                          <li className="high_priorety">
                                            <Link href="/">Delete Image</Link>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>
                            <li className="fn__gl_item">
                              <div className="fn__gl__item">
                                <div className="abs_item">
                                  <img src="images/gallery/4.jpg" alt="" />
                                  <div className="all_options">
                                    <div className="fn__icon_options medium_size">
                                      <Link
                                        href="/"
                                        className="fn__icon_button"
                                      >
                                        <img
                                          src="svg/download.svg"
                                          alt=""
                                          className="fn__svg"
                                        />
                                      </Link>
                                      <div className="fn__icon_popup">
                                        <ul>
                                          <li>
                                            <Link href="/">Original Image</Link>
                                          </li>
                                          <li>
                                            <Link href="/">
                                              Creative Upscaled Image
                                            </Link>
                                          </li>
                                          <li>
                                            <Link href="/">
                                              HD Upscaled Image
                                            </Link>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                    <div className="fn__icon_options medium_size">
                                      <Link
                                        href="/"
                                        className="fn__icon_button"
                                      >
                                        <img
                                          src="svg/upscale.svg"
                                          alt=""
                                          className="fn__svg"
                                        />
                                      </Link>
                                      <div className="fn__icon_popup">
                                        <ul>
                                          <li>
                                            <Link href="/">
                                              Creative Upscale
                                            </Link>
                                          </li>
                                          <li>
                                            <Link href="/">
                                              Alternative Upscale
                                            </Link>
                                          </li>
                                          <li>
                                            <Link href="/">HD Upscale</Link>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                    <div className="fn__icon_options medium_size">
                                      <Link
                                        href="/"
                                        className="fn__icon_button"
                                      >
                                        <span className="dots"></span>
                                      </Link>
                                      <div className="fn__icon_popup">
                                        <ul>
                                          <li>
                                            <Link href="/">
                                              Make Variations
                                            </Link>
                                          </li>
                                          <li className="high_priorety">
                                            <Link href="/">Delete Image</Link>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="generation_more">
                        <Link
                          href="pricing.html"
                          className="techwave_fn_button medium"
                        >
                          <span>Previous Generations</span>
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="generation__sidebar">
                    <div className="sidebar_model">
                      <div className="fn__select_model">
                        <Link className="model_open" href="">
                          <img
                            className="user_img"
                            src="images/user/user.jpg"
                            alt=""
                          />
                          <div className="author">
                            <h4 className="subtitle">Model</h4>
                            <h3 className="title">ArtShaper v3</h3>
                          </div>
                          <span className="fn__icon_button">
                            <img
                              src="svg/arrow.svg"
                              alt=""
                              className="fn__svg"
                            />
                          </span>
                        </Link>
                        <div className="all_models">
                          <ul>
                            <li>
                              <Link className="selected" href="/">
                                ArtShaper v3
                              </Link>
                            </li>
                            <li>
                              <Link href="/">ArtShaper v2</Link>
                            </li>
                            <li>
                              <Link href="/">GameVisuals</Link>
                            </li>
                            <li>
                              <Link href="/">VintageCar</Link>
                            </li>
                            <li>
                              <Link href="/">ArtDeco</Link>
                            </li>
                            <li>
                              <Link href="/">IceCold</Link>
                            </li>
                            <li>
                              <Link href="/">Water Effect</Link>
                            </li>
                            <li>
                              <Link href="/">Stable Diffusion v2</Link>
                            </li>
                            <li>
                              <Link href="/">Stable Diffusion v1</Link>
                            </li>
                            <li>
                              <Link href="/">Other</Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="sidebar_details">
                      <div className="number_of_images">
                        <h4 className="title">Number of Images</h4>
                        <div className="fn__quantity">
                          <Link href="/" className="decrease"></Link>
                          <input type="number" value="4" max="20" min="1" />
                          <Link href="/" className="increase"></Link>
                        </div>
                      </div>
                      <div className="img_sizes">
                        <h4 className="title">Image Dimensions</h4>
                        <div className="img_size_select">
                          <select>
                            <option value="512_512" selected>
                              512 x 512px
                            </option>
                            <option value="768_768">768 x 768px</option>
                            <option value="512_1024">512 x 1024px</option>
                            <option value="768_1024">768 x 1024px</option>
                            <option value="1024_1024">1024 x 1024px</option>
                          </select>
                        </div>
                      </div>
                      <div className="guidance_scale">
                        <h4 className="title">
                          Image Dimensions
                          <span
                            className="fn__tooltip"
                            title="Select the resoultion of the images."
                          >
                            <img
                              src="svg/question.svg"
                              alt=""
                              className="fn__svg"
                            />
                          </span>
                        </h4>
                        <div className="fn__range">
                          <div className="range_in">
                            <input type="range" min="1" max="40" value="7" />
                            <div className="slider"></div>
                          </div>
                          <div className="value">7</div>
                        </div>
                      </div>
                      <div className="prompt_magic_switcher">
                        <h4 className="title">
                          <label for="prompt_switcher">Prompt Magic</label>
                          <span
                            className="fn__tooltip"
                            title="TechWave Prompt v3.0. Our custom render pipeline which has much faster compliance and can improve the result with any model selected. Applies a 2x multiplier to accepted costs due to higher GPU overhead."
                          >
                            <img
                              src="svg/question.svg"
                              alt=""
                              className="fn__svg"
                            />
                          </span>
                        </h4>
                        <label className="fn__toggle">
                          <span className="t_in">
                            <input
                              type="checkbox"
                              checked
                              id="prompt_switcher"
                            />
                            <span className="t_slider"></span>
                            <span className="t_content"></span>
                          </span>
                        </label>
                      </div>
                      <div className="contrast_switcher">
                        <h4 className="title">
                          <label for="contrast_switcher">High Contrast</label>
                          <span
                            className="fn__tooltip"
                            title="If your photo consists of extremely bright and dark areas, then it's considered high contrast. When it has a wide range of tones that go from pure white to pure black, it's medium contrast. No pure whites or blacks and a range of middle tones means it's low contrast."
                          >
                            <img
                              src="svg/question.svg"
                              alt=""
                              className="fn__svg"
                            />
                          </span>
                        </h4>
                        <label className="fn__toggle">
                          <span className="t_in">
                            <input type="checkbox" id="contrast_switcher" />
                            <span className="t_slider"></span>
                            <span className="t_content"></span>
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <footer className="techwave_fn_footer">
                <div className="techwave_fn_footer_content">
                  <div className="copyright">
                    <p>2023© ITB23</p>
                  </div>
                  <div className="menu_items">
                    <ul>
                      <li>
                        <Link href="terms.html">Terms of Service</Link>
                      </li>
                      <li>
                        <Link href="privacy.html">Privacy Policy</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Image;
