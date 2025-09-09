import { Button } from "@/components/ui/button";

interface Feature {
  image: string;
  title: string;
  description: string;
}

interface Timeline3Props {
  heading: string;
  description: string;
  buttons: {
    primary: {
      text: string;
      url: string;
    };
    secondary: {
      text: string;
      url: string;
    };
  };
  features?: Feature[];
}

const Timeline3 = ({
  heading = "Your One-Day Journey",
  description = "From idea to deployment in a single day. Here's exactly what happens during your VibePHX Builder experience.",
  buttons = {
    primary: {
      text: "Reserve Your Spot — $99",
      url: "https://luma.com/cvlfi81t",
    },
    secondary: {
      text: "Learn More",
      url: "#faq",
    },
  },
  features = [
    {
      image: "/schedule/boitumelo-v7xiSfj6mGI-unsplash.jpg",
      title: "9:00 AM - Setup & Introductions",
      description:
        "Coffee, introductions, and setting up your development environment. We'll configure your tools and get you ready to build.",
    },
    {
      image: "/schedule/fahim-muntashir-14JOIxmsOqA-unsplash.jpg", 
      title: "10:00 AM - AI-Assisted Development",
      description:
        "Learn to use Claude, Cursor, and v0 effectively. Transform your idea into a working prototype using AI pair programming.",
    },
    {
      image: "/schedule/marc-mintel-70dtB7MkdRI-unsplash.jpg",
      title: "1:00 PM - Deployment & Production",
      description: 
        "After lunch, deploy your app to production. Set up domains, SSL certificates, and proper hosting with real URLs.",
    },
    {
      image: "/schedule/van-tay-media--S2-AKdWQoQ-unsplash.jpg",
      title: "4:00 PM - Polish & Launch",
      description:
        "Final touches, testing, and launch preparation. Leave with a working URL and the confidence to build more.",
    },
  ],
}: Timeline3Props) => {
  return (
    <section className="py-20" id="schedule">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="relative grid gap-16 md:grid-cols-2">
          <div className="top-40 h-fit md:sticky">
            <h2 className="mt-4 mb-6 text-4xl font-semibold md:text-5xl text-white">
              {heading}
            </h2>
            <p className="font-medium text-gray-400 md:text-xl">
              {description}
            </p>
            <div className="mt-8 flex flex-col gap-4 lg:flex-row">
              <Button variant="primary" size="lg" className="gap-2" asChild>
                <a href={buttons.primary.url} target="_blank" rel="noopener noreferrer">
                  {buttons.primary.text}
                </a>
              </Button>
              <Button variant="outline" size="lg" className="gap-2" asChild>
                <a href={buttons.secondary.url}>{buttons.secondary.text}</a>
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-12 md:gap-20">
            {features.map((feature, index) => (
              <div key={index} className="rounded-xl border border-gray-800 bg-gray-900/50 p-2">
                <div className="aspect-video w-full rounded-xl border border-gray-700 bg-gray-800 flex items-center justify-center p-8">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="mb-1 text-2xl font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Timeline3 };