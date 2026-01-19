import { Link } from "react-router";

export default function Header({ user }) {
  function handleHeaderAccountOptions() {
    if (!user) {
      return (
        <>
          <li>
            <Link to="/login" viewTransition>
              Log In
            </Link>
          </li>
          <li>
            <Link className="special" to="/signup" viewTransition>
              Sign Up
            </Link>
          </li>
        </>
      );
    }

    return (
      <>
        <li>
          <a>Logout</a>
        </li>
        <li>
          <Link className="special" to={`/users/${user.id}`}>
            {user.username}
          </Link>
        </li>
      </>
    );
  }

  return (
    <section className="baseSection headerSection">
      <div className="headerContents">
        <Link to="/">
          <h1>The Golb Blog</h1>
        </Link>

        <div className="navbar">
          <ul className="navlinks">
            <li>
              <Link to="/blogs" viewTransition>
                Blog
              </Link>
            </li>
            <li>
              <span className="separator"></span>
            </li>
            {handleHeaderAccountOptions()}
          </ul>
        </div>
      </div>
    </section>
  );
}
