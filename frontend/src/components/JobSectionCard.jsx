import React from "react";
import { useNavigate } from "react-router-dom";

function JobSectionCard({ id, title, employer, date, description }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/kariyer/${id}`);
  };
  return (
    <div
      onClick={handleCardClick}
      className="flex w-full xl:flex-1 flex-col justify-between p-4 bg-transparent border-primary border rounded-2xl h-[320px] hover:bg-primary/3 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
    >
      <div className="job-content-container flex gap-6 flex-col">
        <div className="job-content-header-content flex flex-col gap-1">
          <h3
            className="text-2xl text-primary font-bold truncate"
            title={title}
          >
            {title}
          </h3>
          <h5 className="text-base text-primary truncate" title={employer}>
            {employer}
          </h5>
        </div>
        <p
          className="text-base overflow-hidden text-ellipsis"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
            lineHeight: "1.5em",
            maxHeight: "6em",
          }}
        >
          {description}
        </p>
      </div>
      <div className="job-date-container flex gap-2 items-center">
        <p className="text-sm text-gray-400">
          {new Date(date).toLocaleDateString("tr-TR")}
        </p>
      </div>
    </div>
  );
}

export default JobSectionCard;
