import React from "react";
import { Route, NavLink, withRouter } from "react-router-dom";
import { baseUrl, backdropUrl } from "../../variables";
import { useFetch } from "../../hooks/useFetch";
import Loading from "../../components/Loading";
import Related from "../Related";
import Recommended from "../Recommended";
import Reviews from "../ReviewsPage";
import Cast from "../../components/Cast";
import CrewList from "../../components/CrewList";
const MovieDetails = props => {
  const [loading, movieData, error] = useFetch(
    `${baseUrl}/${props.match.params.movieId}?api_key=${
      process.env.REACT_APP_API_KEY
    }&language=en-US`,
    [props.match.params.movieId]
  );
  let movie = null;
  if (movieData) {
    movie = movieData;
  }
  let content = <Loading />;
  if (error === true) {
    props.history.push("/error");
  }
  if (!loading && movie) {
    const {
      title,
      backdrop_path,
      overview,
      genres,
      release_date,
      runtime,
      vote_average
    } = movie;
    const imgUrl = backdrop_path
      ? `${backdropUrl}/${backdrop_path}`
      : require("../../assets/film-reel-backdrop.jpg");
    content = (
      <>
        <div
          style={{
            background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${imgUrl})`,
            backgroundPosition: "center"
          }}
          className="movie-details-container"
        >
          <div className="details-info">
            <h2 className="details-title">{title}</h2>
            <div className="date-time-vote">
              <p>{release_date.slice(0, 4)}</p>
              <p>{runtime} minutes</p>
              <p>{vote_average}/10</p>
            </div>
            <ul className="genre-list">
              {genres.map(genre => (
                <li key={genre.id}>{genre.name} </li>
              ))}
            </ul>
            <p className="details-overview">{overview}</p>
          </div>
          <div className="details-link-shadow">
            <div className="details-link-container">
              <NavLink exact to={`/movie/${props.match.params.movieId}`}>
                Cast
              </NavLink>
              <NavLink to={`/movie/${props.match.params.movieId}/crew`}>
                Crew
              </NavLink>
              <NavLink to={`/movie/${props.match.params.movieId}/reviews`}>
                Reviews
              </NavLink>
              <NavLink to={`/movie/${props.match.params.movieId}/related`}>
                Related<span className="hide-sm-mobile"> Titles</span>
              </NavLink>
              <NavLink to={`/movie/${props.match.params.movieId}/recommended`}>
                Recommended
              </NavLink>
            </div>
          </div>
        </div>
        <Route
          exact
          path="/movie/:movieId"
          render={props => (
            <Cast
              {...props}
              url={`${baseUrl}/${props.match.params.movieId}/credits?api_key=${
                process.env.REACT_APP_API_KEY
              }&language=en-US`}
            />
          )}
        />
        <Route
          exact
          path="/movie/:movieId/crew"
          render={props => (
            <CrewList
              {...props}
              url={`${baseUrl}/${props.match.params.movieId}/credits?api_key=${
                process.env.REACT_APP_API_KEY
              }&language=en-US`}
            />
          )}
        />
        <Route
          exact
          path="/movie/:movieId/reviews"
          render={props => (
            <Reviews movieId={props.match.params.movieId} {...props} />
          )}
        />
        <Route
          exact
          path="/movie/:movieId/related"
          render={props => <Related {...props} />}
        />
        <Route
          exact
          path="/movie/:movieId/recommended"
          render={props => <Recommended {...props} />}
        />
      </>
    );
  }
  return <div>{content}</div>;
};

export default withRouter(MovieDetails);
