import React from "react";

function RoadmapCard(props) {
  return (
    <div className="roadmap-card bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer transition-all duration-100 hover:shadow-xl hover:border-gray-300">
      {/* 16:9 Aspect Ratio Image Container */}
      <div className="aspect-video w-full bg-gray-200 overflow-hidden">
        <img
          src={props.image || "/src/assets/img/graduate.jpg"}
          alt={props.title}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-primary mb-2 line-clamp-2">
          {props.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {props.description}
        </p>
        <p className="text-xs text-gray-400 mb-4">{props.date}</p>
        
        {/* Button */}
        <button className="w-full bg-primary text-white py-2 px-4 rounded-md font-medium hover:bg-primary/90 transition-colors duration-200">
          Okumaya Başla
        </button>
      </div>
    </div>
  );
}

export default RoadmapCard; 