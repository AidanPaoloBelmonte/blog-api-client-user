import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import axios from "axios";

import "../res/blog.css";

export default function BlogPost() {
  const { id } = useParams();
  const [blog, setBlog] = useState({});

  useEffect(() => {
    async function fetchBlogPost() {
      try {
        const response = await axios.get(`http://localhost:3000/blogs/${id}`);

        if (response.data?.blog) {
          setBlog(response.data.blog);
          return;
        }
      } catch (err) {
        return setBlog({ error: err });
      }

      setBlog({ error: "Failed to get blogpost." });
    }

    fetchBlogPost();
  }, [id]);

  function handleBlogDisplay() {
    if (Object.keys(blog).length === 0) {
      return <p>Loading Post...</p>;
    }

    if (blog?.error) {
      return <p>{blog.error}</p>;
    }

    return (
      <>
        <h2>{blog.title}</h2>
        <p className="date">{new Date(blog.creationDate).toDateString()}</p>
        <p>{blog.article.content}</p>
      </>
    );
  }

  function handleCommentsDisplay() {
    if (blog?.comments) {
      return (
        <section className="baseSection commentsSection">
          <h2>Comments</h2>
          {blog.comments.map((comment) => {
            const authorComponent = comment?.author ? (
              <>
                <Link to={`/users/${comment.author.id}`} className="author">
                  {comment.author.username}
                </Link>
              </>
            ) : (
              <p className="author">anonymous</p>
            );

            return (
              <div key={comment.id} className="comment">
                <div className="details">
                  {authorComponent}
                  <p className="date">
                    {new Date(blog.creationDate).toDateString()}
                  </p>
                </div>
                <p className="content">{comment.content}</p>
              </div>
            );
          })}
        </section>
      );
    }

    return <></>;
  }

  return (
    <>
      <section className="baseSection blogPostSection">
        {handleBlogDisplay()}
      </section>
      {handleCommentsDisplay()}
    </>
  );
}
