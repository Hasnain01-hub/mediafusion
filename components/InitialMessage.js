import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Select, Space } from "antd";
import React from "react";
import { toast, ToastContainer } from "react-toastify";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { useSelector } from "react-redux";
import axios from "axios";
import pdfToText from "./PdfParse";

const InitialMessage = ({
  setInput,
  handleSubmit,
  setdrawer,
  drawer,
  setInitialMessage,
  setMessages,
  setopen,
  open,
  _select,
  setSelect,
  setload,
  handleChange,
  load,
  input,
  setimage,
}) => {
  const inputFile = React.useRef(null);

  const { user } = useSelector((state) => state.user);

  const handlefile = async (e) => {
    e.preventDefault();
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
          console.log(output);
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
      setimage((prev) => [...prev, false]);
      setMessages((state) => [
        ...state,
        "Elaborate the following file " + files[0].name,
      ]);
      setload(true);
      setInitialMessage(false);
      console.log(files);
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
        console.log(content, "content");
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
        <div className="chat__page">
          {/* <div className="font__trigger">
            <span></span>
          </div> */}
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
          <div className="fn__title_holder">
            <div
              style={{ display: "flex", justifyContent: "space-between" }}
              className="container"
            >
              {console.log(drawer)}
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

          <div className="container">
            <div className="chat__list">
              <div id="chat0" className="chat__item"></div>

              <div className="chat__item active" id="chat1">
                <div className="chat__box your__chat">
                  <div className="author">
                    <span>You</span>
                  </div>
                  <div className="chat">
                    <p>What is a chat bot?</p>
                  </div>
                </div>

                <div className="chat__box bot__chat">
                  <div className="author">
                    <span>Bot</span>
                  </div>
                  <div className="chat">
                    <p>
                      At the most basic level, a chatbot is a computer program
                      that simulates and processes human conversation (either
                      written or spoken), allowing humans to interact with
                      digital devices as if they were communicating with a real
                      person. Chatbots can be as simple as rudimentary programs
                      that answer a simple query with a single-line response, or
                      as sophisticated as digital assistants that learn and
                      evolve to deliver increasing levels of personalization as
                      they gather and process information.
                    </p>
                  </div>
                </div>

                <div className="chat__box your__chat">
                  <div className="author">
                    <span>You</span>
                  </div>
                  <div className="chat">
                    <p>How do chatbots work?</p>
                  </div>
                </div>

                <div className="chat__box bot__chat">
                  <div className="author">
                    <span>Bot</span>
                  </div>
                  <div className="chat">
                    <p>
                      Chatbots boost operational efficiency and bring cost
                      savings to businesses while offering convenience and added
                      services to internal employees and external customers.
                      They allow companies to easily resolve many types of
                      customer queries and issues while reducing the need for
                      human interaction.
                    </p>
                  </div>
                </div>
              </div>

              <div className="chat__item" id="chat2"></div>

              <div className="chat__item" id="chat3"></div>

              <div className="chat__item" id="chat4"></div>
            </div>
          </div>

          <div className="chat__comment">
            <div className="container">
              <div className="fn__chat_comment">
                <div className="new__chat">
                  <p>
                    Ask it questions, engage in discussions, or simply enjoy a
                    friendly chat.
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
                  onKeyDown={(e) => {
                    if (e.key == "Enter") {
                      handleSubmit(e);
                    }
                  }}
                  placeholder="Send a message..."
                  id="fn__chat_textarea"
                ></textarea>
                <div
                  style={{
                    display: "flex",
                  }}
                >
                  <button onClick={handleSubmit}>
                    <img src="svg/enter.svg" alt="" className="fn__svg" />
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
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default InitialMessage;
