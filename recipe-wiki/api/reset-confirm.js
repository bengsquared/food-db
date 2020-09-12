const faunadb = require("faunadb");
const client = new faunadb.Client({ secret: process.env.FAUNA_DB_KEY });

module.exports = (req, resp) => {
  if (req.body.token) {
    client
      .query(
        q.Select(
          [data, 0],
          q.Paginate(
            q.Match(q.Index("find_chef_email_by_token"), req.body.token)
          ),
          "noMatch"
        )
      )
      .then((res) => {
        if (res.data === "noMatch") {
          resp.send("failure_token_expired");
        } else {
          client
            .query(
              q.Update(
                q.Ref(
                  q.Collection("chefs"),
                  q.Select([data, chefid], q.Get(res.data))
                ),
                {
                  credentials: {
                    password: req.body.password,
                  },
                }
              )
            )
            .then(resp.send("success"));
        }
      });
  }
  res.json({
    body: req.body,
    query: req.query,
    cookies: req.cookies,
  });
};
