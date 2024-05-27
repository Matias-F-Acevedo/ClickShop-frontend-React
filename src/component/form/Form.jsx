import "./form.css";
const Form = () => {
  return (
    <div className="contact-wrapper-home">
      <section className="contact-title-home">
        <h2 className="contact-home">Contact</h2>
        <p className="contact-subtitle-home">
          Ante cualquier duda envianos un mensaje por este medio
          de contacto, te responderemos en breve.
        </p>
      </section>
      <form className="contact-form-home">
        <label>
          Name
          <br />
          <input className="form-inputs-home"/>
        </label>
        <label>
          Email
          <br />
          <input className="form-inputs-home"/>
        </label>
        <label>
          Phone
          <br />
          <input className="form-inputs-home"/>
        </label>
        <label>
          Message
          <br />
          <textarea rows={5} className="textarea-form-home"/>
        </label>
        <label>
          <input type="file" className="file-input-home"/>
        </label>
        <div className="button-wrapper-home">
        <button className="button-form-home">Enviar</button>
        </div>
      </form>
    </div>
  );
};

export default Form;
