
export async function getAll(url, jwt) {
  try {
    const headers = {};
    if (jwt) {
      headers.Authorization = `Bearer ${jwt}`;
    }

    const res = await fetch(url, {
      method: 'GET',
      headers: headers,
    });
    return res;
  } catch (err) {
    console.error(err);
  }
}

export async function getById(id, url, jwt) {
  try {
    const headers = {};
    if (jwt) {
      headers.Authorization = `Bearer ${jwt}`;
    }

    const res = await fetch(`${url}/${id}`, {
      method: 'GET',
      headers: headers,
    });
    return res;
  } catch (err) {
    console.error(err);
  }
}

export async function post(url, body, jwt) {
  try {
    const headers = {
      "Content-Type": "application/json",
    };
    if (jwt) {
      headers.Authorization = `Bearer ${jwt}`;
    }

    const res = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    });
    return res;
  } catch (err) {
    console.error(err);
  }
}

export async function updatePut(fullUrl, body, jwt) {
  try {
    const headers = {
      "Content-Type": "application/json",
    };
    if (jwt) {
      headers.Authorization = `Bearer ${jwt}`;
    }

    const res = await fetch(fullUrl, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify(body),
    });
    return res;
  } catch (err) {
    console.error(err);
  }
}

export async function updatePatch(fullUrl, body, jwt) {
  try {
    const headers = {
      "Content-Type": "application/json",
    };
    if (jwt) {
      headers.Authorization = `Bearer ${jwt}`;
    }
    const res = await fetch(fullUrl, {
      method: "PATCH",
      headers: headers,
      body: JSON.stringify(body),
    });
    return res;
  } catch (err) {
    console.error(err);
  }
}

export async function remove(fullUrl, jwt) {
  try {
    const headers = {};
    if (jwt) {
      headers.Authorization = `Bearer ${jwt}`;
    }
    const res = await fetch(fullUrl, {
      method: 'DELETE',
      headers: headers,
    });
    return res;
  } catch (err) {
    console.error(err);
  }
}

