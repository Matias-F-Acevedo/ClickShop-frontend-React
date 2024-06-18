import "./form.css";
import React, { useRef, useState } from 'react';
import emailjs from 'emailjs-com';

const Form = () => {

  const refForm = useRef();

  const [formStatus, setFormStatus] = useState(""); // Estado para el msj de éxito o error

  const handleSubmit = (event) => {
    event.preventDefault();

    const serviceId = "service_f01hts8";
    const templateId= "template_v0ast95";
    const apiKey = "WyFQIBjaf3plHMnJF";

    emailjs.sendForm(serviceId, templateId, refForm.current, apiKey)
      .then(result => {
        console.log(result.text);
        refForm.current.reset(); // Limpia el form luego del envio exitoso
        setFormStatus("success"); 
      })
      .catch(error => {
        console.log(error);
        setFormStatus("error"); 
      });
  }

  return (
    <div className="contact-wrapper-home">
      <section className="contact-title-home">
        <h2 className="contact-home">Contact</h2>
        <p className="contact-subtitle-home">
          Ante cualquier duda o consulta, envíanos un mensaje por este medio
          de contacto, nuestro soporte de trabajo te respondera lo antes posible.
        </p>
      </section>
      
      <form className="contact-form-home" ref={refForm} onSubmit={handleSubmit}>
        <label htmlFor="username">Name</label>
        <input className="form-inputs-home" name='username' type="text" placeholder='Ej: Belocchi Sofia' required/>

        <label htmlFor="email">Email</label>
        <input className="form-inputs-home" name='email' type="email" placeholder='Ej: sofiabelocchi@gmail.com' required/>

        <label htmlFor="phone">Phone</label>
        <input className="form-inputs-home" name='phone' type="phone" placeholder='Ej: 2281-224466' required/>

        <label>Message</label>
        <textarea rows={5} className="textarea-form-home" placeholder='type your message' name="message"/>
        

        <div className="button-wrapper-home">
          <button className="button-form-home">Send</button>
        </div>
      </form>

      {formStatus === "success" && (
        <div className="success-message">
          ¡Enviado con éxito!
        </div>
      )}

      {formStatus === "error" && (
        <div className="error-message">
          El mensaje no pudo enviarse.
        </div>
      )}
    </div>
  );
};

export default Form;