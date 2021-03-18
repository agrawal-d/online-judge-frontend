const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === "[::1]" ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

const config = {
  root: isLocalhost
    ? "http://localhost:3001"
    : "https://bits-judge.herokuapp.com", // frontend,
  apiBase: isLocalhost
    ? "http://localhost:3000/api/v0"
    : "https://bits-judge-server.herokuapp.com/api/v0", //backend
};

export default config;
