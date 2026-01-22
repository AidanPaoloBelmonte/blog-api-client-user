import { useState, useEffect } from "react";
import { Link, useOutletContext, useParams } from "react-router";
import { useForm } from "react-hook-form";
import axios from "axios";

import "../res/blog.css";
import { useCallback } from "react";

export default function BlogPost() {
  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    getValues,
    formState: { isDirty, isValid, errors },
  } = useForm({
    mode: "all",
    defaultValues: {
      comment: "",
    },
  });

  const { id } = useParams();
  const { user } = useOutletContext();
  const [isWritingComment, setWritingComment] = useState(false);
  const [blog, setBlog] = useState({});
  const [comments, setComments] = useState([]);

  const fetchComments = useCallback(async () => {
    console.log("Fetching comments!");

    try {
      const response = await axios.get(
        `http://localhost:3000/blogs/${id}/comments`,
      );

      if (response.data?.comments) {
        setComments(response.data.comments);
      }
    } catch (err) {
      console.log(err);
    }
  }, [id]);

  useEffect(() => {
    async function fetchBlogPost() {
      try {
        const response = await axios.get(`http://localhost:3000/blogs/${id}`);

        if (response.data?.blog) {
          setComments(response.data.blog.comments);

          response.data.comments = null;
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

  function onNewCommentInit() {
    setWritingComment(true);
  }

  function onNewCommentEnd() {
    setWritingComment(false);
  }

  function handleCommentErrorDisplay() {
    if (errors?.comment)
      return <p className="formError inline">{errors.comment.message}</p>;
  }

  async function onSubmit(data) {
    const response = await axios.post(
      `http://localhost:3000/blogs/${id}/comments`,
      data,
      {
        withCredentials: true,
      },
    );

    if (!response.data?.error) {
      onNewCommentEnd();
      await fetchComments(id);
    } else {
      console.log("damne");
    }
  }

  const onNewCommentInput = (e) => {
    let c = e.target.innerText;
    if (c.length > 255) {
      c = c.substring(0, 255);

      e.target.innerText = c;

      /// Keeping Caret at end of Line
      /// Source: https://www.tutorialpedia.org/blog/how-to-move-the-cursor-to-the-end-of-a-contenteditable-entity/
      // Create a range that selects all text and collapses at the end
      e.target.focus();
      const range = document.createRange();
      if (e.target?.lastChild) {
        range.setStartAfter(e.target.lastChild);
      } else {
        range.setStartAfter(e.target, 0);
      }
      range.collapse();

      // Apply Range
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }

    setValue("comment", c, {
      shouldValidate: true,
      shouldDirty: true,
    });
    trigger("comment");
  };

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

  function handleCommentFormDisplay() {
    if (!isWritingComment) {
      return (
        <button
          className="comment prompt"
          type="button"
          onClick={onNewCommentInit}
        >
          <p>Post your thoughts!</p>
        </button>
      );
    }

    return (
      <div>
        <form className="postComment" onSubmit={handleSubmit(onSubmit)}>
          <div className={`formEntry ${errors?.comment ? "invalid" : ""}`}>
            <label htmlFor="comment">New Comment</label>
            <input
              {...register("comment", {
                pattern: {
                  value: /.*\S.*/,
                  message: "The comment cannot be only spaces",
                },
                maxLength: {
                  value: 255,
                  message: "Comments cannot be any longer than 255 characters",
                },
                required: {
                  value: true,
                  message: "The comment must have content.",
                },
              })}
            ></input>
            <div className="asInputField">
              <div
                className="field"
                onInput={onNewCommentInput}
                role="textbox"
                contentEditable
              ></div>
              <div className="asInputStatus">
                Count:{" "}
                {getValues != undefined || getValues("comment") != undefined
                  ? getValues("comment").length
                  : 0}
                /255
              </div>
            </div>
            {handleCommentErrorDisplay()}
          </div>
          <div className="formFooter">
            <p className="commentWarn">
              Posting as <b>{user?.username ? user.username : "anonymous"}</b>
            </p>
            <div className="buttons">
              <button
                className="negative"
                type="button"
                onClick={onNewCommentEnd}
              >
                Discard
              </button>
              <button
                type="submit"
                className="submit"
                disabled={!isDirty || !isValid}
              >
                Post
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  function handleCommentsDisplay() {
    const commentsArray = comments.map((comment) => {
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
            <p className="date">{new Date(blog.creationDate).toDateString()}</p>
          </div>
          <p className="content">{comment.content}</p>
        </div>
      );
    });

    return (
      <section className="baseSection commentsSection">
        <h2>Comments</h2>
        {handleCommentFormDisplay()}
        {commentsArray}
      </section>
    );
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
