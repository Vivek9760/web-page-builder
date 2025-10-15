import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="container min-vh-100 d-flex justify-content-center align-items-start py-5">
      <div className="card shadow-lg p-4 p-md-5" style={{ maxWidth: "800px" }}>
        <div className="card-body">
          <h2 className="card-title text-center text-success mb-4">Privacy Policy 🤫</h2>

          <p>Welcome to our “super secret” privacy policy!</p>

          <p>
            1. <strong>Your Data? Totally Ours</strong>
            <br />
            Don’t worry — we <em>might</em> look at what you do here, but only because we’re curious, not because we’re creepy. Maybe.
          </p>

          <p>
            2. <strong>Cookies 🍪</strong>
            <br />
            Yes, we use cookies. Not the chocolate-chip kind, unfortunately. These ones help us remember your preferences, because apparently, humans
            forget stuff.
          </p>

          <p>
            3. <strong>Third Parties</strong>
            <br />
            We might share your data with third parties… like cats on the internet, or maybe analytics tools that make us feel important. Don’t sue
            us.
          </p>

          <p>
            4. <strong>Your Secrets</strong>
            <br />
            We promise to keep your secrets… unless they’re really interesting, then we might tell our friends. Kidding! (Mostly)
          </p>

          <p>
            5. <strong>Legal Stuff</strong>
            <br />
            By using this app, you accept our terms… and also that we’re probably having a laugh while writing this.
          </p>

          <p className="text-muted mt-4">TL;DR: We try not to mess with your privacy, but we also like jokes. Thanks for using our app!</p>

          <hr />

          <p className="text-center text-secondary small mt-3">
            ⚠️ Disclaimer: This app is currently under development. We’re just kidding around with this Privacy Policy — nothing here is legally
            binding… yet.
          </p>
        </div>
      </div>
    </div>
  );
}
