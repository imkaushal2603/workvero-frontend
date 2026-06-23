import Header from "../components/header";
import Footer from "../components/footer";

const PublicLayout = ({ children }) => (
  <div className="public-layout">
    <Header />
    <main>{children}</main>
    <Footer />
  </div>
);

export default PublicLayout;