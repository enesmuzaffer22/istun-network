import React from "react";
import HeroCard from "./HeroCard";

const heroPrimaryButtonStyles =
  "bg-primary text-white px-8 py-3 rounded-full hover:bg-primary/90 transition-colors cursor-pointer";
const heroSecondaryButtonStyles =
  "bg-white text-primary px-8 py-3 rounded-full border border-primary hover:bg-primary hover:text-white transition-colors cursor-pointer";

function Hero() {
  return (
    <div className="px-4 md:px-[120px] pt-16 md:pt-[120px] w-full flex justify-center flex-col gap-[90px]">
      <div className="hero-content-container flex flex-col gap-6 justify-center items-center w-full">
        <div className="hero-content-text-container justify-center items-center flex flex-col gap-6">
          <h2 className="text-6xl font-bold text-center w-3/4">
            İş fırsatları, staj imkanları ve kariyer rehberliği tek platformda.
            Geleceğine bugünden başla.
          </h2>
          <p className="text-center text-base md:text-xl text-gray-500 w-2/3">
            Öğrenci topluluğumuzda güncel iş ilanları, staj fırsatları ve
            kariyer yol haritalarını keşfet. Deneyimli profesyonellerden
            rehberlik al, forumlarımızda sorularını sor ve kariyerinde bir adım
            öne geç.
          </p>
        </div>
        <div className="hero-buttons-container flex flex-col sm:flex-row gap-4 mt-4">
          <button className={heroPrimaryButtonStyles}>Keşfetmeye Başla!</button>
          <button className={heroSecondaryButtonStyles}>Hakkımızda</button>
        </div>
      </div>
      <div className="hero-cards-container flex w-full gap-4">
        <HeroCard
          image="https://picsum.photos/480"
          title="İş Fırsatları"
          description="Güncel iş ilanlarını keşfet"
        />
        <HeroCard
          image="https://picsum.photos/480"
          title="İş Fırsatları"
          description="Güncel iş ilanlarını keşfet"
        />
        <HeroCard
          image="https://picsum.photos/480"
          title="İş Fırsatları"
          description="Güncel iş ilanlarını keşfet"
        />
      </div>
    </div>
  );
}

export default Hero;
