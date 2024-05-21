import "./carousel.css";
import Car1 from "../../assets/car-1.png";
import Car2 from "../../assets/car-2.png";
import Car3 from "../../assets/car-3.png";
import Car4 from "../../assets/car-4.png";
const Carousel = () => {
  const data = [
    {
      img: Car1,
      title: "BMW SERIE 220I - 2.0 184CV",
      price: "US$52.000",
    },
    {
      img: Car2,
      title: "CASA EN TANDIL CON PARQUE, PILETA Y PARRILLA",
      price: "US$425.000",
    },
    {
      img: Car3,
      title: "FORD RANGER 2024 - V6",
      price: "US$48.000",
    },
    {
      img: Car4,
      title: "FORD FOCUS 2014",
      price: "US$17.000",
    },
  ];
  return (
    <div className="carousel">
      <h2 className="latest">Ultimas publicaciones</h2>
      <section className="card-wrapper">
        {data?.map((article, index) => (
          <div key={index} className="card">
            <img src={article.img} alt={article.title} />
            <h5>{article.title}</h5>
            <p>{article.price}</p>
          </div>
        ))}
      </section>
    </div>
  );
};
export default Carousel;
