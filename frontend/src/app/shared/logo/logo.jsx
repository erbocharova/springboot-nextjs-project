import React from "react";
import Link from "next/link";
import "./logo.scss";

const Logo = () => {
  return (
    <div className="header-logo-sultan">
      <Link href="/" className="logo-sultan-link">
        <img
          src="/icons/logo.png"
          alt="Султан"
          width={156}
          height={66}
          className="logo-sultan"
        />
      </Link>
    </div>
  );
};

export default Logo;
