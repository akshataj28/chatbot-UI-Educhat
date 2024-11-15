import { Metadata } from "next";

export const metadata: Metadata = {
  title: "EntrySurvey",
};

export default function SurveyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
