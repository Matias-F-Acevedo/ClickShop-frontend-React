import "./form.css";
const Form = () => {
  return (
    <div className="contact-wrapper">
      <section className="contact-title">
        <h2 className="contact">Contact</h2>
        <p className="contact-subtitle">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since.
        </p>
      </section>
      <form className="contact-form">
        <label>
          Name
          <br />
          <input className="form-inputs"/>
        </label>
        <label>
          Email
          <br />
          <input className="form-inputs"/>
        </label>
        <label>
          Phone
          <br />
          <input className="form-inputs"/>
        </label>
        <label>
          Message
          <br />
          <textarea rows={5} className="textarea-form"/>
        </label>
        <label>
          <input type="file" className="file-input"/>
        </label>
        <div className="button-wrapper">
        <button className="button-form">SEND</button>
        </div>
      </form>
    </div>
  );
};

export default Form;
