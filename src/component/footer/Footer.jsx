import "./footer.css";
const Footer = () => {
  return (
    <>
    <footer className="foot">
      <div className="foot-col-1">
        <h2>ClickShop</h2>
        <h3>TRABAJO PRACTICO</h3>
        <p style={{width:"335px"}}>
          Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
          sint. Velit officia consequat duis enim velit mollit. Exercitation.
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
