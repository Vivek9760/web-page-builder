import React from "react";

export default function TermCondition() {
  return (
    <div className="container min-vh-100 d-flex justify-content-center align-items-start py-5">
      <div className="card shadow-lg p-4 p-md-5" style={{ maxWidth: "800px" }}>
        <div className="card-body">
          <h2 className="card-title text-center text-success mb-4">Terms & Conditions ⚖️</h2>

          <p>Welcome to the most thrilling legal document you’ll ever read!</p>

          <p>
            1. <strong>Use at Your Own Risk</strong>
            <br />
            By using this app, you accept that we might do unexpected things… but mostly harmless. Probably. Maybe. Don’t sue us.
          </p>

          <p>
            2. <strong>No Warranty</strong>
            <br />
            This app is provided “as-is.” If it crashes, burns your device, or somehow launches a rocket, that’s not on us.
          </p>

          <p>
            3. <strong>Account Responsibilities</strong>
            <br />
            You promise not to be a villain. Any villainy is totally on you, and we reserve the right to laugh at you silently.
          </p>

          <p>
            4. <strong>Content</strong>
            <br />
            Anything you post might be seen by others, remembered by our servers, or admired by squirrels. Don’t post illegal stuff… obviously.
          </p>

          <p>
            5. <strong>Changes to Terms</strong>
            <br />
            We can change these terms whenever we want. We’ll probably tell you… maybe in a carrier pigeon, maybe here. Keep checking.
          </p>

          <p className="text-muted mt-4">TL;DR: Use responsibly, don’t sue us, and have fun. Enjoy the app!</p>

          <hr />

          <p className="text-center text-secondary small mt-3">
            ⚠️ Disclaimer: This app is currently under development. We’re just kidding around with these Terms & Conditions — nothing here is legally
            binding… yet.
          </p>
        </div>
      </div>
    </div>
  );
}
