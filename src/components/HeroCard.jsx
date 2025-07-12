import React from "react";

function HeroCard(props) {
  return (
    <div className="relative h-[480px] flex-1 rounded-xl overflow-hidden">
      <img
        src={props.image}
        alt="Card image"
        className="absolute inset-0 w-full h-full object-cover grayscale"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-red-600/70 to-transparent"></div>

      <div className="absolute bottom-0 left-0 p-4 text-white z-10 flex flex-col gap-2">
        <h3 className="text-3xl font-bold">{props.title}</h3>
        <p className="text-base text-white/90">{props.description}</p>
      </div>
    </div>
  );
}

export default HeroCard;
