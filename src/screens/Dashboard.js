import { db } from "../firebase-config";
import { signOut } from "firebase/auth";
import { authentication } from "../firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Dashboard.scss";

const Dashboard = (props) => {
  const navigate = useNavigate();
  const [allBlogs, setAllBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newBlog, setNewBlog] = useState({
    title: "",
    content: "",
    author: props.userData.providerData[0].displayName || "",
    datePosted: new Date().getTime(),
  });

  const handleInputChange = (e) => {
    setNewBlog({ ...newBlog, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    getBlogs();
  }, []);

  useEffect(() => {
    console.log(allBlogs);
  }, [allBlogs]);

  const blogsCollectionRef = collection(db, "blogs");

  const showFilteredData = async () => {
    const q = query(
      blogsCollectionRef,
      where("author", "==", props.userData.providerData[0].displayName)
    );
    const querySnapshot = await getDocs(q);
    setAllBlogs(
      querySnapshot.docs.map((blog) => ({ ...blog.data(), id: blog.id }))
    );
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  };
  const deleteBlog = async (id) => {
    const target = doc(db, "blogs", id);
    setLoading(true);

    await deleteDoc(target)
      .then((res) => {
        console.log("blog deleted", res);
        setLoading(false);
        getBlogs();
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const getBlogs = async () => {
    setLoading(true);
    await getDocs(blogsCollectionRef)
      .then((res) => {
        setLoading(false);
        setAllBlogs(res.docs.map((blog) => ({ ...blog.data(), id: blog.id })));
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const handleAddBlog = (e) => {
    e.preventDefault();
    setLoading(true);
    addDoc(blogsCollectionRef, newBlog)
      .then((res) => {
        setLoading(false);
        console.log("added successfully");
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
    getBlogs();
    setNewBlog({
      title: "",
      content: "",
      author: props.userData.providerData[0].displayName || "",
      datePosted: new Date().getTime(),
    });
  };

  const handleSignOut = () => {
    signOut(authentication)
      .then(() => {
        window.localStorage.removeItem("signin-token");
        navigate("/");
        console.log("Signed out successfully");
      })
      .catch((err) => {
        console.log("Some error occured while signing out :", err);
      });
  };
  if (loading === true) {
    return <h3>Loading</h3>;
  }
  return (
    <div className="dashboardWrapper">
      <div className="navbar">
        <div className="title">Firebase Assignment - Blog App</div>
        <div className="buttons">
          <button className="signoutBtn" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
        <div className="name">Developed by : Jayesh Singh</div>
      </div>
      <div className="profile">
        <p>Application Dashboard</p>
        <pre>
          {JSON.stringify(props.userData.providerData[0].displayName, null, 4)}
        </pre>
        {/* <h4>{props.userData.displayName}</h4> */}
        <img src={props.userData.photoURL} alt="avatarImg" />
      </div>
      <div className="allBlogs">
        <div className="allBlogTop">
          <h1>All blogs</h1>
          <button onClick={getBlogs}>Show All Blogs</button>
          <button onClick={showFilteredData}>Filter my blogs</button>
        </div>
        <div className="blogList">
          {allBlogs.map((blog) => (
            <div className="blogBox" key={blog.id}>
              <h4>{blog.title}</h4>
              <h6>By: {blog.author}</h6>
              <p className="blogDate">
                Posted on: {new Date(blog.datePosted).toString()}
              </p>
              <p>"{blog.content}"</p>
              <button onClick={() => deleteBlog(blog.id)}>Delete blog</button>
            </div>
          ))}
        </div>
        <div className="addBlog">
          <h1>Add a new blog</h1>
          <form onSubmit={handleAddBlog}>
            <label htmlFor="title">Blog Title</label>
            <input
              type="text"
              name="title"
              value={newBlog.title}
              onChange={handleInputChange}
            />

            <label htmlFor="Content">Blog Content</label>
            <textarea
              name="content"
              value={newBlog.content}
              onChange={handleInputChange}
              rows={10}
              cols={10}
            />
            <button type="submit">Add</button>
          </form>
        </div>
      </div>
      <div className="footer">Quantiphi SD - J2J Batch 2022</div>
    </div>
  );
};

export default Dashboard;
