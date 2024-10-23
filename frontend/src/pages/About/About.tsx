import "./About.css";

const About = () => {
  return (
    <div className="about-container">
      <div className="tittle">
        <h3>About Our Online Payment System</h3>
      </div>
      <div className="discription">
        <img
          src="https://www.shutterstock.com/image-vector/thin-line-easy-contactless-payment-600nw-1707796087.jpg"
          alt=""
        />
        <p>
          Welcome to our Online Payment System, a convenient and secure platform
          for managing your product transactions effortlessly. Our system allows
          users to easily add product details, including descriptions and
          photos, and save them directly to our database. <br /> Once all
          desired products are added, users can proceed to checkout, where they
          can securely enter their credentials and complete the payment process
          with confidence. We also provide a payment history page where users
          can review all their recent transactions for their records. <br />
          For security and personalized access, our system features user
          authentication, ensuring that all your information and transactions
          remain safe and accessible only to you.
        </p>
      </div>
      <div className="about-footer">
        <hr />
        <p>
          Experience hassle-free and secure online payments with our system,
          designed to simplify your shopping journey!
        </p>
      </div>
    </div>
  );
};

export default About;
