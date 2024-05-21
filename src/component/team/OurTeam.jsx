import "./team.css";
import Team from "../../assets/team.png";
import Fran from "../../assets/francisco.svg";
import Github from "../../assets/mdi_github.png";
import { Link } from "react-router-dom";
const Ourteam = () => {
  const members = [
    {
      img: Fran,
      name: "Francisco Diaz",
      Github: "https://www.github.com",
    },
    {
      img: Team,
      name: "Francisco Diaz",
      Github: "https://www.github.com",
    },
    {
      img: Team,
      name: "Francisco Diaz",
      Github: "https://www.github.com",
    },
    {
      img: Team,
      name: "Francisco Diaz",
      Github: "https://www.github.com",
    },
  ];
  return (
    <div className="team-wrapper">
      <section className="team-title">
        <h2 className="title">Our team</h2>
        <p className="subtitle">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since.
        </p>
      </section>
      <section className="member-wrapper">
        {members?.map((member, index) => (
          <article className="member-card" key={index}>
            <img src={member.img} alt="team-members" />
            <h3>{member.name}</h3>
            <Link to={member.Github} target="_blank">
              <img src={Github} alt="github-icon" />
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
};
export default Ourteam;
