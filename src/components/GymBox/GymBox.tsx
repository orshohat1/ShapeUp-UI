import React, { useState, useEffect } from "react";
import { Button, Popconfirm, Modal, Input, List, notification } from "antd";
import { EditOutlined, DeleteOutlined, MessageOutlined } from '@ant-design/icons';
import { io, Socket } from "socket.io-client";
import './GymBox.less';

interface GymBoxProps {
  gymName: string;
  city: string;
  ownerId: string;
  onEdit: () => void;
  onDelete: () => void;
}

const CHAT_SERVER_URL = "http://localhost:3002";
const PATH = "/users-chat";

const socket: Socket = io(CHAT_SERVER_URL, {
  path: PATH,
  transports: ["websocket", "polling"],
});

const GymBox: React.FC<GymBoxProps> = ({
  gymName,
  city,
  ownerId,
  onEdit,
  onDelete,

}) => {
  const [isChatModalVisible, setChatModalVisible] = useState(false);
  const [chatUsers, setChatUsers] = useState<{ userId: string; firstName: string; lastName: string }[]>([]);
  const [selectedUser, setSelectedUser] = useState<{ userId: string; firstName: string; lastName: string } | null>(null);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  useEffect(() => {
    if (!ownerId) return;

    socket.on("message", (message) => {
      if (!selectedUser || message.sender === selectedUser || message.sender === ownerId) {
        setMessages((prevMessages) => {
          return [...prevMessages, message];
        });
      }
    });

    return () => {
      socket.off("message");
    };
  }, [ownerId, selectedUser]);

  const fetchChatUsers = () => {
    socket.emit("get_gym_chats", ownerId, (chatData: any) => {
      if (chatData) {
        const uniqueUsers = Array.from(
          new Map(chatData.map((user: any) => [user.userId, user])).values()
        );
        setChatUsers(uniqueUsers.map((user: any) => ({
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName
        })));
      } else {
        notification.error({ message: "Failed to load chat users." });
      }
    });
  };
  
  const fetchChatHistory = (userId: string) => {
    socket.emit("get_users_chat", ownerId, userId, gymName, (chatHistory: any) => {
      const formattedMessages = chatHistory.messages.map((msg: any) => ({
        sender: msg.sender.toString(),
        text: msg.text,
        timestamp: msg.timestamp
      }));
      setMessages(formattedMessages || []);
    });
  };

  const openChatModal = () => {
    setChatModalVisible(true);
    setSelectedUser(null);
    setMessages([]);
    fetchChatUsers();

    socket.emit("add_user", ownerId);
  };

  const selectUser = (user: { userId: string; firstName: string; lastName: string }) => {
    setSelectedUser(user);
    setInterval(() => { fetchChatHistory(user.userId); }, 1000);
  };
  
  const sendMessage = () => {
    if (!newMessage.trim() || !selectedUser) return;

    const message = { sender: ownerId, text: newMessage };
    socket.emit("communicate", ownerId, selectedUser.userId, gymName, newMessage);
    setMessages((prev) => 
      prev.some((msg) => msg.text === newMessage && msg.sender === ownerId) 
        ? prev 
        : [...prev, message]
    );
    setNewMessage("");
  };

  return (
    <div className="gym-box">
      <div className="gym-box-header">
        <h3>{gymName}</h3>
        <div className="gym-box-icons">
          <EditOutlined onClick={onEdit} className="gym-box-icon" />

          <Popconfirm
            title="Are you sure you want to delete this gym?"
            onConfirm={onDelete}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined className="gym-box-icon" />
          </Popconfirm>
        </div>
      </div>
      <p>{city}</p>
      <Button type="primary" className="gym-box-button" icon={<MessageOutlined />} onClick={openChatModal}>
        Chat with Users
      </Button>

      <Modal 
          title={selectedUser ? `Chat with ${selectedUser.firstName} ${selectedUser.lastName}` : "Chat with Users"} 
          open={isChatModalVisible} 
          onCancel={() => setChatModalVisible(false)} 
          footer={null}
        >
        {!selectedUser ? (
          <List
          bordered
          dataSource={chatUsers}
          renderItem={(user) => (
            <List.Item onClick={() => selectUser(user)} style={{ cursor: "pointer" }}>
              {user.firstName} {user.lastName}
            </List.Item>
          )}
        />
        ) : (
          <>
            <Button type="default" onClick={() => setSelectedUser(null)}>
              Back to User List
            </Button>
            <List
              dataSource={messages}
              renderItem={(msg) => (
                <List.Item>
                  <strong>{String(msg.sender) === String(ownerId) ? "You" : "User"}:</strong> {msg.text}
                </List.Item>
              )}
            />
            <div className="chat-input-container">
              <Input.TextArea rows={2} value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type your message..." />
              <Button type="primary" onClick={sendMessage} block>
                Send
              </Button>
            </div>

          </>
        )}
      </Modal>
    </div>
  );
};

export default GymBox;
