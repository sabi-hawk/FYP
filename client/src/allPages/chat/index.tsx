import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { userChats } from "../../api/conversation";
import Conversation from "../../components/Conversation";
import { setChatsData } from "../../flux/reducers/chats";
import Dashboard from "../../images/home.png";
import Noti from "../../images/noti.png";
import Comment from "../../images/comment.png";
import { UilSetting } from "@iconscout/react-unicons";
import ChatBox from "../../components/ChatBox";
import { io } from "socket.io-client";
import { AtomState } from "../../flux/store";
// import useActions from "../../hooks";
import ErrorComponent from "../../utils";
import { AxiosError } from "axios";
import { setUser } from "../../flux/reducers/auth";
// import { Socket } from "dgram";

function Chat() {
  // const { EmptyAppState } = useActions();
  const user = useSelector((state: AtomState) => state?.auth?.user);
  if (!user) {
    console.log("user doesn't exists in chat");
  }
  // const user = useMemo(
  //   () => ({
  //     id: "63c03518077d70ab9ca19a1c",
  //   }),
  //   []
  // );
  // const user = {
  //   id: "63c03518077d70ab9ca19a1c",
  // };
  // const { user } = useSelector((state: any) => state.user);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [sendMessage, setSendMessage] = useState(null);
  const [receiveMessage, setReceiveMessage] = useState(null);

  const dispatch = useDispatch();
  const socket = useRef<any>();

  // initializing socket
  useEffect(() => {
    socket.current = io("http://localhost:3002");
    socket?.current?.emit("new-user-add", user._id);
    socket.current.on("get-users", (users: any) => {
      setOnlineUsers(users);
      console.log(onlineUsers);
    });
  }, [user]); // [user]

  // send message to the socket server
  useEffect(() => {
    if (sendMessage !== null) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage]);

  // receive message from socket server
  useEffect(() => {
    socket?.current?.on("receive-message", (data: any) => {
      setReceiveMessage(data);
    });
  }, []);

  useEffect(() => {
    console.log("inside getting chat ");
    const getChats = async () => {
      try {
        const { data } = await userChats(user._id, user.token);

        dispatch(setChatsData(data));
        setChats(data);
        console.log("Chats", chats);
      } catch (error: any) {
        if (error.response.status === 401) {
          dispatch(setUser({}));
          dispatch(setChatsData({}));
        }
        console.log("Error | Pages | Chat", error);
      }
    };
    getChats();
  }, [user]); //[user]

  const checkOnlineStatus = (chat: any) => {
    const chatMember = chat.members.find((member: any) => member !== user._id);
    const online = onlineUsers.find((user: any) => user.userId === chatMember);
    return online ? true : false;
  };
  // const handleSetCurrentChat = ({ event, chat }) => {
  //   setCurrentChat(chat);
  // };
  return (
    <div className="chat p-4">
      <div className="left-side-chat">
        <div className="chat-container">
          <h2>Chats</h2>
          <div className="chat-list">
            {chats.map((chat, key) => (
              <div key={key} onClick={() => setCurrentChat(chat)}>
                <Conversation
                  data={chat}
                  currentUserId={user._id}
                  online={checkOnlineStatus(chat)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="right-side-chat">
        <div /*style={{ width: "20rem", alignSelf: "flex-end" }}*/>
          {/* <div className="navIcons">
            <Link to="../dashboard">
              <img src={Dashboard} alt="" />
            </Link>
            <UilSetting />
            <img src={Noti} alt="" />
            <Link to="../chat">
              <img src={Comment} alt="" />
            </Link>
          </div> */}
          <ChatBox
            chat={currentChat}
            setSendMessage={setSendMessage}
            receiveMessage={receiveMessage}
          />
        </div>
      </div>
    </div>
  );
}

export default Chat;
