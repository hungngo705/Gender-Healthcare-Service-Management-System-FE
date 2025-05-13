import React from "react";

function Footer() {
  return (
    <footer className="app-footer">
      <div className="container">
        <p>
          &copy; {new Date().getFullYear()} Gender Healthcare Service Management
          System. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
