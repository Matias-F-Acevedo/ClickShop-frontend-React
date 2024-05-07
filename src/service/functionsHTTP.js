export async function addOne(body, url) {

    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json"
    },
      body: JSON.stringify(body),
    })
  
      .then((res) => res.json()).then((parsed)=>console.log(parsed)).catch((err) => console.error(err));
  
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