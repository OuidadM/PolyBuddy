import "./LandingPage.css";
import Feature from "./components/Feature/index";
import Clouds from "./components/Clouds/index";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Transition from "./components/Transition";
import Footer from "./components/Footer";

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
          image="src\pages\LandingPage\assets\feature1.png"
        />
        <Feature
          title="Échange et apprends ensemble"
          subtitle="Participe à des discussions, pose tes questions et partage ton expérience."
          image="src\pages\LandingPage\assets\feature2.png"
        />
        <Feature
          title="Reste guidé et bien informé"
          subtitle="Accède à des conseils sur les cours, la vie sur le campus et les démarches administratives."
          image="src\pages\LandingPage\assets\feature3.png"
        />
      </div>

      {/* CLOUD FRAME */}
      <Clouds />

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
