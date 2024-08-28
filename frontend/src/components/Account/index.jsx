import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/posts";
import Cookies from "js-cookie";
import "./index.scss";

const Account = () => {
  const { id } = useParams();

  const [password, setPassword] = useState("");
  const [account, setAccount] = useState("Account");

  const [avatar, setAvatar] = useState("");
  const [newAvatar, setNewAvatar] = useState("");
  const [bio, setBio] = useState("");

  const [myBlogs, setMyBlogs] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getMyUsername();
    getMyAvatar();
    getMyBio();
    getMyBlogs();
  }, [id]);

  const getMyUsername = async () => {
    try {
      const response = await api.get("/myaccount");
      if (response) {
        setAccount(response.data.username);
      } else {
        setAccount("Account");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getMyAvatar = async () => {
    try {
      const response = await api.get("/avatar", {
        params: {
          id: id,
        },
      });
      setAvatar(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getMyBio = async () => {
    try {
      const response = await api.get("/bio", {
        params: {
          id: id,
        },
      });
      setBio(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getMyBlogs = async () => {
    try {
      const response = await api.get(`/users/${id}/blogs`, {
        params: {
          id: id,
        },
      });
      setMyBlogs(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ##########################################################################

  const logout = async () => {
    // send a request to the server to delete the session
    const response = await api.delete(`/session`);
    alert(response.data);
    // remove the session cookie
    Cookies.remove("sessionID");
    // redirect to home
    navigate("/");
  };

  const deleteAccount = async () => {
    try {
      if (password === "") {
        alert("Please enter your password to delete your account");
        return;
      }
      // delete the account
      const response = await api.delete("/myaccount", {
        data: {
          password: password,
        },
      });
      alert(response.data);

      // remove the session cookie
      Cookies.remove("sessionID");
      // redirect to home
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="name-container">
        <h1>@{account}</h1>
      </div>
      <div className="profile-container">
        <img src={avatar} alt="Avatar" className="avatar" />
        <p>{bio}</p>
      </div>
      <div className="blogs-container">
        <h2>
          There {myBlogs.length == 1 ? "is" : "are"} {myBlogs.length}{" "}
          {myBlogs.length == 1 ? "Blog" : "Blogs"}
        </h2>
        <div>
          {myBlogs &&
            myBlogs.map((blog) => {
              return (
                <div key={blog.id} className="blog">
                  <h3>{blog.title}</h3>
                  <div className="date">{Date(blog.created_at)}</div>
                  {blog.media.includes("video") ? (
                    <video src={blog.media} controls></video>
                  ) : (
                    <img src={blog.media} alt="Picture" />
                  )}
                  <p>{blog.content}</p>
                </div>
              );
            })}
        </div>
      </div>

      <div className="settings-container">
        <h2>Settings</h2>
        <div className="account-settings">
          <label htmlFor="logout">
            Click here to log out:
            <button className="logout" onClick={logout}>
              Logout
            </button>
          </label>
          <div className="delete-account-container">
            <label htmlFor="password">
              Enter Password to Delete Account:
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                required
              />
            </label>
            <button type="submit" onClick={deleteAccount}>
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Account;
