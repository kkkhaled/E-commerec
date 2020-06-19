const { View } = require("grandjs");

const forgotPassword = ({ resetUrl }) => {
  return (
    <div>
      <h3>Dear client...</h3>
      <p>
        if uou forget your password you can update your password from here{" "}
        {resetUrl}
      </p>
    </div>
  );
};
module.exports = forgotPassword;
