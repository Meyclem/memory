import fetch from "isomorphic-unfetch"

async function get() {
  const response = await fetch(`${process.env.API_BASE_URL}/games`)
  return response.json()
}

async function post(data) {
  await fetch(`${process.env.API_BASE_URL}/games`, {
    method: "post",
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
    },
  })
}

export { get, post }
