export async function addOne(body, url) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const parsed = await response.json();
    return parsed; // Devolvemos la respuesta JSON
  } catch (err) {
    console.error('Error al crear el producto:', err);
    throw err; // Lanzamos el error para que pueda ser capturado en el componente
  }
}

  
  
  
  export async function updateOne(id, body, url) {
    await fetch(`${url}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify(body),
    })
      .then((res) => res.json()).then((parsed)=>console.log(parsed)).catch((err) => console.error(err));
  }
  
  
  
  
  export function deleteOne(id, url) {
    fetch(`${url}/${id}`, {
        method: 'DELETE',
    })
      .then((res) => res.json()).then((parsed)=>console.log(parsed)).catch((err) => console.error(err));
  }