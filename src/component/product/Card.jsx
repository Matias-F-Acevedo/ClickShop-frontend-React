import "./card.css"


function Card({ product, index }) {
    const {
      product_name,
      description,
      price,
      category,
    } = product;
  
    // Verificar si category es null antes de acceder a su propiedad name
    const categoryName = category ? category.name : 'Sin categoría';
  
    return (
      <div key={index} className="product-card">
        <section className="product-details">
          <h2 className="product-name">{product_name}</h2>
          <p className="product-description">{description}</p>
          <p className="product-price">Price: ${price}</p>
          <p className="product-category">Category: {categoryName}</p>
        </section>
      </div>
    );
  }
  
  export default Card;
  