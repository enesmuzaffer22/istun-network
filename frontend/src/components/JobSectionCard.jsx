import React from "react";

function JobSectionCard({ title, employer, date, description }) {
  return (
    <div className="flex w-full xl:flex-1 flex-col justify-between p-4 bg-transparent border-primary border rounded-2xl h-[320px] hover:bg-primary/3">
      <div className="job-content-container flex gap-6 flex-col">
        <div className="job-content-header-content flex flex-col gap-1">
          <h3 className="text-2xl text-primary font-bold">{title}</h3>
          <h5 className="text-base text-primary">{employer}</h5>
        </div>
        <p className="text-base">{description}</p>
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
