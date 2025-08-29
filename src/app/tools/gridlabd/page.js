import ProtectedGridlabdPage from "@/components/ProtectedGridlabdPage";

export const metadata = {
  title: "GridLab-D Web IDE",
  description:
    "Run GridLab-D models in the browser or cloud with an interactive web IDE. Edit GLM, run, view logs, outputs, and visualizations.",
  alternates: {
    canonical: "/tools/gridlabd",
  },
  openGraph: {
    title: "GridLab-D Web IDE | Saral",
    description:
      "Interactive IDE to author and run GridLab-D models with console, files, and plots.",
    url: "https://www.saral.energy/tools/gridlabd",
    images: [
      {
        url: "/vercel.svg",
        width: 1200,
        height: 630,
        alt: "GridLab-D Web IDE",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GridLab-D Web IDE | Saral",
    description:
      "Author and run GridLab-D models online with console, outputs, and visualization.",
    images: ["/vercel.svg"],
  },
};

export default function Page() {
  return (
    <main>
      <ProtectedGridlabdPage />
    </main>
  );
}
