import "./Home.css";
import Feature from "../Feature/index";
import Clouds from "../Clouds/index";
import Navbar from "../Navbar";
import Hero from "../Hero";
import Transition from "../Transition";
import Footer from "../Footer";

export default function HomePage() {
  return (
    <div className="page">
      {/* NAVBAR */}
      <Navbar />

      {/* WELCOME IMAGE */}
      <Hero />

      {/*Transition*/}
      <Transition />

      {/* FEATURES */}
      <div className="features">
        <Feature
          title="Trouve ton binôme d'intégration"
          subtitle="Connecte-toi avec des étudiants qui partagent ta filière, tes intérêts ou ta langue."
          image="src\pages\Home\assets\feature1.png"
        />
        <Feature
          title="Échange et apprends ensemble"
          subtitle="Participe à des discussions, pose tes questions et partage ton expérience."
          image="src\pages\Home\assets\feature2.png"
        />
        <Feature
          title="Reste guidé et bien informé"
          subtitle="Accède à des conseils sur les cours, la vie sur le campus et les démarches administratives."
          image="src\pages\Home\assets\feature3.png"
        />
      </div>

      {/* CLOUD FRAME */}
      <Clouds />

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
