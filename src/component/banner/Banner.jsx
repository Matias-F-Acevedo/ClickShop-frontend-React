import "./banner.css";
import Rectangle1 from "../../assets/Rectangle 7.png"
import Rectangle2 from "../../assets/Rectangle 6.png"
const Banner = () => {
  return (
    <section className="banner-home">
      <div className="left-box-home">
        <h2>Tu e-commerce</h2>
        <p>
        Descubre una experiencia de compra única y personalizada. Desde productos de alta calidad hasta 
        ofertas exclusivas, estamos aquí para satisfacer todas tus necesidades. Navega por nuestras 
        categorías, encuentra lo que amas y disfruta de un servicio al cliente excepcional.
        </p>
        <div>
          <button className="store-home">Ver productos</button>
          <button className="team-home">Ver equipo</button>
        </div>
      </div>
      <div className="banner-images-home">
        <img alt="banner-image" src={Rectangle1} className="img-1"/>
        <img alt="banner-image" src={Rectangle2} className="img-2"/>
      </div>
    </section>
  );
};
export default Banner;
