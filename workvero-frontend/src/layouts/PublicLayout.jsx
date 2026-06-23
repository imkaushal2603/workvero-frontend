import Header from "../components/Header";
import Footer from "../components/Footer";

const PublicLayout = ({ children }) => (
  <div className="public-layout">
    <Header />
    <main>{children}</main>
    <Footer />
  </div>
);

export default PublicLayout;