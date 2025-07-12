import React from "react";

function HeroCard(props) {
  return (
    <div className="relative h-[480px] w-full md:flex-1 md:min-w-0 rounded-3xl overflow-hidden">
      <img
        src={props.image}
        alt="Card image"
        className="absolute inset-0 w-full h-full object-cover grayscale"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-primary to-primary/20"></div>

      <div className="absolute bottom-0 left-0 p-6 text-white z-10 flex flex-col gap-2">
        <h3 className="text-2xl lg:text-3xl font-bold">{props.title}</h3>
        <p className="text-sm md:text-base lg:text-base text-white/90">
          {props.description}
        </p>
      </div>
    </div>
  );
}

export default HeroCard;
