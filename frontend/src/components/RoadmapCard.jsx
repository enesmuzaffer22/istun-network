import React from "react";

function RoadmapCard(props) {
  return (
    <div className="roadmap-card bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer transition-all duration-100 hover:shadow-xl hover:border-gray-300 h-full flex flex-col">
      <div className="aspect-video w-full bg-gray-200 overflow-hidden">
        <img
          src={props.image || "/src/assets/img/graduate.jpg"} // Eğer resim yoksa varsayılanı göster
          alt={props.title}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-primary mb-2 line-clamp-2">
          {props.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-3 flex-grow">
          {props.description}
        </p>
        <p className="text-xs text-gray-400 mb-4">{props.date}</p>
        
        <button className="w-full bg-primary text-white py-2 px-4 rounded-md font-medium hover:bg-primary/90 transition-colors duration-200 mt-auto">
          Okumaya Başla
        </button>
      </div>
    </div>
  );
}

export default RoadmapCard;