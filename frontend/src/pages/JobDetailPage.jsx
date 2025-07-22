import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";

const markdownComponents = {
  h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-6 mb-2 text-primary" {...props} />,
  h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-5 mb-2 text-primary" {...props} />,
  h3: ({node, ...props}) => <h3 className="text-xl font-semibold mt-4 mb-2 text-primary" {...props} />,
  h4: ({node, ...props}) => <h4 className="text-lg font-semibold mt-3 mb-1 text-primary" {...props} />,
  h5: ({node, ...props}) => <h5 className="text-base font-semibold mt-2 mb-1 text-primary" {...props} />,
  h6: ({node, ...props}) => <h6 className="text-sm font-semibold mt-2 mb-1 text-primary" {...props} />,
  ul: ({node, ...props}) => <ul className="list-disc ml-6 my-2" {...props} />,
  ol: ({node, ...props}) => <ol className="list-decimal ml-6 my-2" {...props} />,
  li: ({node, ...props}) => <li className="mb-1" {...props} />,
  blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-primary pl-4 italic text-gray-700 my-4" {...props} />,
  a: ({node, ...props}) => <a className="text-primary underline" target="_blank" rel="noopener noreferrer" {...props} />,
  p: ({node, ...props}) => <p className="mb-2" {...props} />,
};

function JobDetailPage() {
  const { slug } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/src/pages/jobsData.json")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((item) => item.slug === slug);
        setJob(found);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div>Yükleniyor...</div>;
  if (!job) return <div>İş ilanı bulunamadı.</div>;

  return (
    <div className="flex flex-col gap-8 2xl:px-[120px] px-4 py-12 md:py-[90px]">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-2">
        {job.job_title}
      </h1>
      <div className="text-primary text-lg mb-1 font-semibold">{job.job_employer}</div>
      <div className="text-gray-400 text-base mb-4">{job.job_date}</div>
      <div className="text-gray-600 text-lg mb-4">
        <ReactMarkdown components={markdownComponents}>{job.job_description}</ReactMarkdown>
      </div>
      <div className="text-base sm:text-lg text-gray-800">
        <ReactMarkdown components={markdownComponents}>{job.job_content}</ReactMarkdown>
      </div>
    </div>
  );
}

export default JobDetailPage; 