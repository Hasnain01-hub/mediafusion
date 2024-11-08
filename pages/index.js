import { Select, Space } from "antd";
import { useRouter } from "next/router";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { toast, ToastContainer } from "react-toastify";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Header from "../components/Header";
import Link from "next/link";
import { useSelector } from "react-redux";
import { logoutSuccess } from "../reducer";
import { auth, db } from "../utils/Firebase";
import Chat from "../components/Chat";
import InitialMessage from "../components/InitialMessage";
import pdfToText from "../components/PdfParse";
import Image from "next/image";
import ChatHistory from "../components/ChatHistory";

const Ai = () => {
  const route = useRouter();
  const { user } = useSelector((state) => state.user);
  const [initialMessageState, setInitialMessage] = React.useState(true);
  const dispatch = useDispatch();
  const [open, setopen] = React.useState(false);
  const [drawer, setdrawer] = React.useState(false);
  const [image, setimage] = React.useState([]);
  const [_select, setSelect] = React.useState("none");
  const [data, setdata] = React.useState([]);
  const [load, setload] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [message, setMessages] = React.useState([]);
  const [navbar, setnavBar] = React.useState(false);
  const reduxDispatch = useDispatch();
  const inputFile = React.useRef(null);
  const handleChange = (value) => {
    setSelect(value);
  };
  useEffect(() => {
    const getmsg = async (receivedEmail) => {
      const docref = await db.collection("history");

      var ans = await docref.doc(receivedEmail).get();
      if (ans.exists) {
        setdata(ans.data().messages);
      }
    };
    if (user && user.email) {
      getmsg(user.email);
    }
  }, [user]);
  const handlefile = async (e) => {
    const files = inputFile.current.files;
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    console.log(files[0]);
    if (files[0].type == "application/pdf") {
      await pdfToText(files[0])
        .then(async (text) => {
          const output = await splitter.createDocuments([text]);
          console.log(text);
          fetch("api/set_vector", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              email: user.email,
              combinedContent: output,
            }),
          });
          toast.success("File uploaded successfully");
        })
        .catch((error) => {
          toast.error("Please try with different file");
          console.error("Failed to extract text from pdf", error);
        });
    } else if (
      files[0].type == "image/png" ||
      files[0].type == "image/jpeg" ||
      files[0].type == "image/jpg"
    ) {
      console.log(files);
      setimage((prev) => [...prev, false]);
      setMessages((state) => [
        ...state,
        "Elaborate the following file " + files[0].name,
      ]);
      setload(true);
      setInitialMessage(false);
      // setMessages((state) => [...state, "Loading..."]);
      const formData = new FormData();
      formData.append("image", files[0]);
      console.log(formData, "formData");
      await fetch(`api/image_text`, {
        method: "POST",
        headers: {
          Accept: "*/*",
        },
        body: formData,
      })
        .then(async (response) => {
          let data = await response.json();
          console.log(data);

          setInitialMessage(false);
          setimage((prev) => [...prev, false]);
          setload(false);

          setMessages((state) => [...state, data.response]);
        })
        .catch((err) => {
          setload(false);
          return console.log("error", err);
        });
    } else {
      function readFileAsText(files) {
        return new Promise((resolve, reject) => {
          var setcontent = [];
          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();
            reader.onload = async (event) => {
              try {
                const content = event.target.result;
                const output = await splitter.createDocuments([content]);
                setcontent = setcontent.concat(output);

                if (i == files.length - 1) {
                  resolve(setcontent);
                }
              } catch (error) {
                console.error(
                  `Error loading content from ${file.name}:`,
                  error
                );
              }
            };
            reader.onerror = () => {
              reject(reader.error); // Reject with the error
            };
            // Read the file as text
            reader.readAsText(file);
          }
        });
      }
      readFileAsText(files).then(async (content) => {
        console.log(content);
        fetch("api/set_vector", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
            combinedContent: content,
          }),
        });
        toast.success("File uploaded successfully");
      });
    }
  };
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
  const handleSubmitAI = async (e) => {
    e.preventDefault();
    if (user && user.email) {
      setload(true);
      setMessages((state) => [...state, input]);
      setimage((prev) => [...prev, false]);
      const response = await fetch("api/chat_with_graph", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          userProfile: user,
          userMessage: input,
        }),
      });

      let data = await response.json();
      console.log(data);
      setInput("");
      setInitialMessage(false);
      // setMessages((state) => [...state, data]);
      if (data.response[0].image_content) {
        const rawBinary = data.response[0].image_src;
        console.log(rawBinary.data, "rawBinary");
        const byteArray = new Uint8Array(rawBinary.data);

        // Create a Blob from the Uint8Array
        const blob = new Blob([byteArray], { type: "image/jpeg" }); // Adjust MIME type as necessary

        // Create an Object URL for the Blob
        const imageUrl = URL.createObjectURL(blob);

        setimage((prev) => [...prev, true]);
        setMessages((state) => [...state, imageUrl]);
        setload(false);
        return;
      }
      setimage((prev) => [...prev, false]);

      setMessages((state) => [...state, data.response[0].content]);
      setload(false);
    } else {
      console.error("No such user profile found!");
    }
  };
  const containerStyle = {
    position: "relative",
    // minHeight: "100vh",
    position: "absolute",
    left: "50%",
    top: "50%",
    zIndex: "100",
    transform: "translate(-50%, -50%)",
    // Make background unselectable
  };
  return (
    <>
      <div style={{ userSelect: load ? "none" : "auto" }}>
        <div className="techwave_fn_fixedsub">
          <ul></ul>
        </div>
        {load && (
          <div style={containerStyle}>
            <Spin
              indicator={
                <LoadingOutlined
                  style={{
                    fontSize: 34,
                  }}
                  spin
                />
              }
            />
          </div>
        )}

        <div className="techwave_fn_wrapper fn__has_sidebar">
          <div className="techwave_fn_wrap">
            <Header
              user={user}
              handleLogout={handleLogout}
              setnavBar={setnavBar}
              navbar={navbar}
            />

            <div
              style={{
                marginRight: drawer ? "300px" : "",
              }}
              className=""
            >
              <div className="techwave_fn_page">
                <div className="techwave_fn_aichatbot_page fn__chatbot">
                  {initialMessageState ? (
                    <InitialMessage
                      initialMessageState={initialMessageState}
                      handleSubmit={handleSubmitAI}
                      setdrawer={setdrawer}
                      setInput={setInput}
                      setInitialMessage={setInitialMessage}
                      setMessages={setMessages}
                      setopen={setopen}
                      drawer={drawer}
                      open={open}
                      _select={_select}
                      setload={setload}
                      setSelect={setSelect}
                      handleChange={handleChange}
                      input={input}
                      setimage={setimage}
                    />
                  ) : (
                    <div className="chat__page">
                      {/* <div className="font__trigger">
                        <span></span>
                      </div> */}

                      <div className="fn__title_holder">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                          className="container"
                        >
                          <h1 className="title">Chat Bot Definition</h1>
                          <span className="icon">
                            <svg
                              onClick={(e) => setdrawer((prev) => !prev)}
                              style={{ width: "25px", cursor: "pointer" }}
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M7.82843 10.9999H20V12.9999H7.82843L13.1924 18.3638L11.7782 19.778L4 11.9999L11.7782 4.22168L13.1924 5.63589L7.82843 10.9999Z"></path>
                            </svg>
                          </span>
                        </div>
                      </div>
                      {image.map((item, idx) => {
                        return (
                          <Chat
                            key={idx}
                            chat={message}
                            initialMessageState={initialMessageState}
                            idx={idx}
                            data={data}
                            setdata={setdata}
                            imgState={image}
                            handleSubmit={handleSubmitAI}
                            email={user.email}
                            setInput={setInput}
                            message={message[idx]}
                            image={item}
                          />
                        );
                      })}
                      <div className="chat__comment">
                        <div className="container">
                          <div className="fn__chat_comment">
                            <div className="new__chat">
                              <p>
                                Ask it questions, engage in discussions, or
                                simply enjoy a friendly chat.
                              </p>
                            </div>
                            <textarea
                              rows="1"
                              className="fn__hidden_textarea"
                              tabindex="-1"
                            ></textarea>
                            <textarea
                              rows="1"
                              value={input}
                              onChange={(e) => {
                                setInput(e.target.value);
                              }}
                              placeholder="Send a message..."
                              id="fn__chat_textarea"
                            ></textarea>
                            <button onClick={handleSubmitAI}>
                              <img
                                src="svg/enter.svg"
                                alt=""
                                className="fn__svg"
                              />
                            </button>
                            <button
                              className="btn2"
                              onClick={() => inputFile.current.click()}
                            >
                              <input
                                type="file"
                                id="file"
                                multiple
                                ref={inputFile}
                                onChange={handlefile}
                                style={{ display: "none" }}
                              />

                              <svg
                                className="fn__svg"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M14 13.5V8C14 5.79086 12.2091 4 10 4C7.79086 4 6 5.79086 6 8V13.5C6 17.0899 8.91015 20 12.5 20C16.0899 20 19 17.0899 19 13.5V4H21V13.5C21 18.1944 17.1944 22 12.5 22C7.80558 22 4 18.1944 4 13.5V8C4 4.68629 6.68629 2 10 2C13.3137 2 16 4.68629 16 8V13.5C16 15.433 14.433 17 12.5 17C10.567 17 9 15.433 9 13.5V8H11V13.5C11 14.3284 11.6716 15 12.5 15C13.3284 15 14 14.3284 14 13.5Z"></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {drawer ? <ChatHistory data={data} /> : <span></span>}
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
      <ToastContainer />
    </>
  );
};

export default Ai;
