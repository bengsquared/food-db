const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const faunadb = require("faunadb");
const client = new faunadb.Client({ secret: process.env.FAUNA_DB_KEY });
var exipry = null;

function randomStr() {
  var ans = "";
  const arr =
    "qqwertyuiop-lkjhgfdsazxcvbnm_1234567890#QWERTYUIOPLKJHGFDSAZXCVB.NM";
  for (var i = 30; i > 0; i--) {
    ans += arr[Math.floor(Math.random() * arr.length)];
  }
  return ans;
}

function invalidateToken(ref) {
  client.query(
    q.Update(ref, {
      data: {
        token: null,
      },
    })
  );
}

module.exports = (req, resp) => {
  var key = randomStr();
  if (req.body.email) {
    client
      .query(
        q.Paginate(q.Match(q.Index("find_chef_email_by_email"), req.body.email))
      )
      .then((res) => {
        if (res.data.length === 0) {
          let msg = {
            to: req.body.email,
            from: "recipebox.help@gmail.com",
            subject: "RecipeBox - Password Reset Request",
            html: `<strong>Hey! <br />This email isn't registered for a RecipeBox account, but you (or somebody else) tried to reset a password for this email. If you want to sign up, go to </strong> https://food-db.vercel.app/signup <br/> -Ben from RecipeBox <br /> ps, if this wasn't you, you can probably ignore it.`,
          };
          sgMail.send(msg);
          resp.send("success");
        } else {
          let tkn = randomStr();
          client
            .query(Update(res.data[1], { data: { token: tkn } }))
            .then((r) => {
              var resetmsg = {
                to: req.body.email,
                from: "recipebox.help@gmail.com",
                subject: "RecipeBox - Password Reset Request",
                html: `<strong>Hey bozo! copy and paste this link to set a new password -- and remember it next time! </strong> https://food-db.vercel.app/password-reset/${tkn} <br /> -Ben from RecipeBox <br /> ps, if this wasn't you, you can probably ignore it.`,
              };
              sgMail.send(resetmsg);
              resp.send("success");
              setTimeout(invalidateToken(res.data[1]), 15000);
            });
        }
      });
  } else {
    resp.send("no_email_provided");
  }
};
