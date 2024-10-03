import Link from "next/link";
//import NominatorInfo from "../../components/nominator-info";
import { Suspense } from "react";
import ValidatorInfo from "../../components/validator-info";

export const metadata = {
  title: "Home",
};

export const API_URL = "test";

export default async function HomePage() {
  return (
    <div>
      <ValidatorInfo />
    </div>
  );
}
