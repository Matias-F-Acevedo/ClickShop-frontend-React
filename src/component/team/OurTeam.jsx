import "./team.css";
import Team from "../../assets/team.png";
import Fran from "../../assets/francisco.svg";
import Mati from "../../assets/mati.svg";
import Matu from "../../assets/matu.svg";
import Sofia from "../../assets/sofia.svg";
import Github from "../../assets/mdi_github.png";
import { Link } from "react-router-dom";
const Ourteam = () => {
  const members = [
    {
      img: Fran,
      name: "Francisco Diaz",
      Github: "https://github.com/FranciscogDiaz",
    },
    {
      img: Mati,
      name: "Matias Cagliero",
      Github: "https://github.com/MatiasCagliero-95",
    },
    {
      img: Matu,
      name: "Matias-F-Acevedo",
      Github: "https://github.com/Matias-F-Acevedo",
    },
    {
      img: Sofia,
      name: "Sofia Belocchi",
      Github: "https://github.com/BelocchiSofia1",
    },
  ];
  return (
    <div className="team-wrapper-home">
      <section className="team-title-home">
        <h2 className="title-home">Nuestro equipo</h2>
        <p className="subtitle-home">
          Siguenos en Github para enterarte de las novedades y herramientas
          que añadimos en la plataforma.
        </p>
      </section>
      <section className="member-wrapper-home">
        {members?.map((member, index) => (
          <article className="member-card-home" key={index}>
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
