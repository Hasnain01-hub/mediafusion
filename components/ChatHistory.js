import Image from "next/image";
import React from "react";

const ChatHistory = ({ data }) => {
  return (
    <>
      <div style={{ overflowY: "auto" }} className="chat__sidebar">
        <div className="sidebar_header">
          <div className="fn__new_chat_link">
            <span className="text">History</span>
          </div>
        </div>
        <div className="sidebar_content">
          <div className="chat__group new">
            {data.map((item, id) => {
              return (
                <div key={id}>
                  <div className="chat__box your__chat">
                    <div className="author">
                      <span>You</span>
                    </div>
                    <div className="chat">{item.question}</div>
                  </div>

                  <div className="chat__box bot__chat">
                    <div className="author">
                      <span>Bot</span>
                    </div>

                    <div className="chat">
                      {item.img_data.img ? (
                        <Image
                          height={300}
                          width={300}
                          style={{
                            margin: "5px auto",
                          }}
                          src={item.img_data.imgUrl}
                          alt="history-image"
                        />
                      ) : (
                        <p>{item.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {/* </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatHistory;
