export function addOne(body, url, jwt) {

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json",
    Authorization:`Bearer ${jwt}`
  },
    body: JSON.stringify(body),
  })

    .then((res) => res.json()).then((parsed)=>console.log(parsed)).catch((err) => console.error(err));

}



export function updateOne(id, body, url, jwt) {
  fetch(`${url}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json",
      Authorization:`Bearer ${jwt}`
      },
    body: JSON.stringify(body),
  })
    .then((res) => res.json()).then((parsed)=>console.log(parsed)).catch((err) => console.error(err));
}




export function deleteOne(id, url, jwt) {
  fetch(`${url}/${id}`, {
      method: 'DELETE',
      headers:{
       Authorization:`Bearer ${jwt}`,   
      } 
  })
    .then((res) => res.json()).then((parsed)=>console.log(parsed)).catch((err) => console.error(err));
}