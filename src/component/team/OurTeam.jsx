import "./team.css";
import Team from "../../assets/team.png";
import Fran from "../../assets/francisco.svg";
import Mati from "../../assets/mati.svg";
import Matu from "../../assets/mati2.png";
import Sofia from "../../assets/sofia.svg";
import Github from "../../assets/mdi_github.png";
import Linkedin from "../../assets/linkedin_icon.svg";
import { Link } from "react-router-dom";
const Ourteam = () => {
  const members = [
    {
      img: Fran,
      name: "Francisco Diaz",
      Github: "https://github.com/FranciscogDiaz",
      Linkedin: "https://www.linkedin.com/in/francisco-diaz1/",
    },
    {
      img: Mati,
      name: "Matias Cagliero",
      Github: "https://github.com/MatiasCagliero-95",
       Linkedin:"https://ar.linkedin.com/in/matias-cagliero-6585921b4?trk=public_profile_browsemap-profile",
    },
    {
      img: Matu,
      name: "Matias-F-Acevedo",
      Github: "https://github.com/Matias-F-Acevedo",
       Linkedin:"https://www.linkedin.com/in/matías-acevedo?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAAEMegEgB-VpzGrcQ2pCtuIr7xF3mB733b00&lipi=urn%3Ali%3Apage%3Ad_flagship3_search_srp_all%3BG2rPTiO%2FSGi0tWcMVhHP6A%3D%3D}",
    },
    {
      img: Sofia,
      name: "Sofia Belocchi",
      Github: "https://github.com/BelocchiSofia1",
      Linkedin:
      "https://ar.linkedin.com/in/sofia-belocchi-b06009273?trk=public_profile_browsemap-profile",
    },
  ];
  return (

    <div className="team-wrapper">
      <section className="team-title">
        <h2 className="title">Nuestro equipo</h2>
        <p className="subtitle">
        Siguenos en Github para enterarte de las novedades y herramientas
          que añadimos en la plataforma o podes contactarnos a traves de LinkedIn
        </p>
      </section>
      <section className="member-wrapper-home">
        {members?.map((member, index) => (
          <article className="member-card-home" key={index}>
            <img src={member.img} alt="team-members" />
            <h3>{member.name}</h3>
            <div>
              <Link to={member.Github} className="icon" target="_blank">
                <img src={Github} alt="github-icon" />
              </Link>
              <Link to={member.Linkedin} className="icon" target="_blank">
                <img src={Linkedin} alt="github-icon" />
              </Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};
export default Ourteam;
