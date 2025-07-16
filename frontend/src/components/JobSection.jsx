import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import JobSectionCard from "./JobSectionCard";

// ScrollTrigger plugin'ini kaydet
gsap.registerPlugin(ScrollTrigger);

function JobSection() {
  // Refs for animations
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const buttonRef = useRef(null);

  // API'den çekilecek iş ilanları placeholder data
  const jobListings = [
    {
      id: 1,
      job_title: "Frontend Developer",
      job_employer: "TechCorp Istanbul",
      job_date: "15.01.2025",
      job_description:
        "React.js, TypeScript ve modern frontend teknolojileri ile web uygulaması geliştirme pozisyonu. Yeni mezunlar başvurabilir.",
    },
    {
      id: 2,
      job_title: "Yazılım Geliştirici Stajyeri",
      job_employer: "Siemens Turkey",
      job_date: "10.01.2025",
      job_description:
        "Java ve Spring Boot kullanarak kurumsal yazılım projelerinde yer alacak stajyer aranıyor. 6 aylık staj programı.",
    },
    {
      id: 3,
      job_title: "Mobile App Developer",
      job_employer: "Startup Ventures",
      job_date: "08.01.2025",
      job_description:
        "Flutter veya React Native ile mobil uygulama geliştirme. Remote çalışma imkanı ve esnek çalışma saatleri.",
    },
    {
      id: 4,
      job_title: "DevOps Engineer",
      job_employer: "Cloud Solutions Ltd",
      job_date: "05.01.2025",
      job_description:
        "AWS, Docker ve Kubernetes deneyimi olan junior DevOps mühendisi aranıyor. CI/CD pipeline kurulum deneyimi artı.",
    },
  ];

  useEffect(() => {
    const header = headerRef.current;
    const cardsContainer = cardsContainerRef.current;
    const button = buttonRef.current;

    // Header animasyonu
    gsap.fromTo(
      header.children,
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.3,
        ease: "power3.out",
        scrollTrigger: {
          trigger: header,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Kartlar animasyonu
    gsap.fromTo(
      cardsContainer.children,
      {
        opacity: 0,
        y: 100,
        scale: 0.8,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: cardsContainer,
          start: "top 85%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Button animasyonu
    gsap.fromTo(
      button,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: button,
          start: "top 90%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className="flex flex-col gap-12 items-center 2xl:px-[120px] px-4 py-12 md:py-[90px]"
    >
      <div
        ref={headerRef}
        className="job-section-header-container flex flex-col items-center gap-4"
      >
        <h2 className="text-3xl xl:text-4xl font-bold text-primary">
          Kariyer Fırsatları
        </h2>
        <p className="text-base text-center text-gray-500 w-full xl:w-2/3">
          İSTÜNetwork olarak, öğrencilerimizin ve mezunlarımızın kariyer
          yolculuklarını desteklemeyi önemsiyoruz. Bu bölümde, sektördeki güncel
          staj ve iş ilanlarına ulaşabilir, mezunlarımızın sağladığı özel
          fırsatlardan yararlanabilir ve geleceğin mühendisleri olarak kendinizi
          geliştirme imkânı bulabilirsiniz. Kariyerine yön vermek, doğru
          adımları atmak ve sektörle güçlü bir bağ kurmak için buradayız!
        </p>
      </div>
      <div
        ref={cardsContainerRef}
        className="flex xl:flex-row flex-col gap-4 w-full"
      >
        {jobListings.map((job) => (
          <JobSectionCard
            key={job.id}
            job_title={job.job_title}
            job_employer={job.job_employer}
            job_date={job.job_date}
            job_description={job.job_description}
          />
        ))}
      </div>

      <button
        ref={buttonRef}
        className="bg-primary text-white px-8 py-3 rounded-full hover:bg-primary/90 transition-colors cursor-pointer md:w-auto w-full"
      >
        Daha Fazlasına Göz At!
      </button>
    </div>
  );
}

export default JobSection;
