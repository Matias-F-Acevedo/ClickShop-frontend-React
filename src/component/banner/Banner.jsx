import "./banner.css";
import Rectangle1 from "../../assets/Rectangle 7.png"
import Rectangle2 from "../../assets/Rectangle 6.png"
const Banner = () => {
  return (
    <section className="banner">
      <div className="left-box">
        <h2>Descripción del TP</h2>
        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book.
        </p>
        <div>
          <button className="store">View Store</button>
          <button className="team">View Team</button>
        </div>
      </div>
      <div className="banner-images">
        <img alt="banner-image" src={Rectangle1} className="img-1"/>
        <img alt="banner-image" src={Rectangle2} className="img-2"/>
      </div>
    </section>
  );
};
export default Banner;
