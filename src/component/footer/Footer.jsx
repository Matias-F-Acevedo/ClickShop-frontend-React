import "./footer.css";
const Footer = () => {
  return (
    <>
    <footer className="foot">
      <div className="foot-col-1">
        <h2>ClickShop</h2>
        <h3>TRABAJO PRACTICO</h3>
        <p style={{width:"335px"}}>
          Esta es tu tienda online preferida, podrás encontrar una gran
          cantidad de productos, incluso publicar los tuyos.
        </p>
      </div>
      <ul className="foot-col-2">
        ABOUT US
        <li>Mission & Vision</li>
        <li>Our Projects</li>
        <li>Our Team</li>
      </ul>
      <ul className="foot-col-3">
        USEFUL LINKS
        <li>Contact Us</li>
        <li>Terms & Conditions</li>
        <li>Review</li>
      </ul>
    </footer>
    <div className="green-banner">.</div>
    </>
  );
};
export default Footer;
